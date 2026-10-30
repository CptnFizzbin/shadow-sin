import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { SourcedGameEffectSelectors } from "#/state/runner/gameEffects/gameEffects.selector.ts"
import { MatrixSelectors } from "#/state/runner/gameState/matrix/matrix.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { AiAttrFormulas } from "#/system/formulas/attributes/aiAttrFormulas.ts"
import { attrAugmentedMax } from "#/system/formulas/attributes/attributeFormulas.ts"
import type { RatingBreakdown, RatingModifier } from "#/system/formulas/ratings/ratingFormulas.ts"
import { RatingFormulas } from "#/system/formulas/ratings/ratingFormulas.ts"
import type {
  AttributeCatalog,
  AttributeInfoCatalog,
  EntityAttributeCatalog,
} from "#/system/model/attributes/attributeCatalog.ts"
import type { EntityAttributeInfo } from "#/system/model/attributes/attributeInfo.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { MetatypeType } from "#/system/model/biology/metatypeData.ts"
import type { EntityBase, EntityWithAttrs } from "#/system/model/entities/entityTraits.ts"
import { isEntityWithAttrs } from "#/system/model/entities/entityTraits.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { isMatrixNode } from "#/system/model/matrix/matrixNodeData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { isRunnerWithBiology } from "#/system/model/runnerTraits.ts"

export namespace AttrSelectors {
  export type AttrSelector<TReturn, TOptions extends object | never = never> = Selector<{
    entity: EntityBase & EntityWithAttrs
  }, TReturn, TOptions>

  export const selectAllRaw = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    (entity) => entity.attributes,
  )

  /** The raw stored value for `key`, or `0` if unset — before modifiers, drugs, or game effects apply. */
  export const selectBase = createMemoizedSelector(
    selectAllRaw,
    SelectorOptions.key.attr,
    (attributes, key) => attributes[key] ?? 0,
  )

  /**
   * The value for `attr` before any modifiers apply, or `0` if unset or inapplicable. For most
   * entities this is the stored value; a Matrix node reads its matrix attributes, and an AI Runner
   * derives its Matrix attributes.
   */
  export const selectRawValue = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    selectAllRaw,
    SelectorOptions.attr,
    (entity, attrs, attr): number => {
      if (isMatrixNode(entity)) {
        return entity.matrix[attr] ?? 0
      }

      if (isRunnerWithBiology(entity)) {
        const isAiMetatype = entity.biology.metatype === MetatypeType.AI
        if (!isAiMetatype) return attrs[attr] ?? 0
        if (attr === AttributeKey.essence) return 0

        const activeNode = MatrixSelectors.selectActiveNode({ runner: entity as RunnerData })

        switch (attr) {
          case AttributeKey.response:
            if (!activeNode) return 0
            return AiAttrFormulas.getResponse({ activeNode })
          case AttributeKey.signal:
            if (!activeNode) return 0
            return AiAttrFormulas.getSignal({ activeNode })
          case AttributeKey.system:
            return AiAttrFormulas.getSystem({
              intuition: attrs[AttributeKey.intuition] ?? 0,
              logic: attrs[AttributeKey.logic] ?? 0,
            })
          case AttributeKey.firewall:
            return AiAttrFormulas.getFirewall({
              willpower: attrs[AttributeKey.willpower] ?? 0,
              charisma: attrs[AttributeKey.charisma] ?? 0,
            })
          default:
            return attrs[attr] ?? 0
        }
      }

      return attrs[attr] ?? 0
    },
  )

  /** @deprecated - use {@link selectRawValue} (before modifiers) or {@link selectRating} (after) instead */
  export const selectValue = (state: { entity: object }, { key }: { key: AttributeKey }): number =>
    selectRawValue(state, { attr: key })

  const selectModifiers = createMemoizedSelector(
    ViewerStateSelectors.selectEntity,
    SourcedGameEffectSelectors.selectAll,
    SelectorOptions.attr,
    (entity, sourcedEffects, attr): RatingModifier[] =>
      // GameEffects belong to the Runner, so they only modify the Runner's own attributes — not
      // those of an Agent or other entity in scope.
      isRunnerWithBiology(entity)
        ? RatingFormulas.getModifiers({ sourcedEffects, type: GameEffectType.attrMod, target: attr })
        : [],
  )

  const selectAugmentedMax = (state: { entity: object, runner: RunnerData }, { attr }: { attr: AttributeKey }) =>
    isRunnerWithBiology(state.entity) && selectBounds(state)[attr]
      ? attrAugmentedMax(selectBounds(state), attr)
      : undefined

  /** The rating for `attr` with the raw value and named modifiers it was computed from. */
  export const selectRatingBreakdown = createMemoizedSelector(
    selectRawValue,
    selectModifiers,
    selectAugmentedMax,
    (rawValue, modifiers, augmentedMax): RatingBreakdown =>
      RatingFormulas.getAttrRating({ rawValue, modifiers, augmentedMax }),
  )

  /** The rating for `attr` used in tests and dice pools: its raw value plus active modifiers, capped at the augmented maximum. */
  export const selectRating = createMemoizedSelector(
    selectRatingBreakdown,
    (breakdown) => breakdown.rating,
  )

  export const forAttr = (attr: AttributeKey) => ({
    selectBase: injectOption(selectBase, { key: attr }),
    /** @deprecated - use `selectRawValue` or `selectRating` instead */
    selectValue: injectOption(selectValue, { key: attr }),
    selectRawValue: injectOption(selectRawValue, { attr }),
    selectRating: injectOption(selectRating, { attr }),
  })

  export const selectBounds = createMemoizedSelector(
    BiologySelectors.selectMetatypeInfo,
    BiologySelectors.selectAwakeningInfo,
    (metatype, awakening): AttributeInfoCatalog => ({
      ...metatype.attributes,
      ...awakening.attributes,
    }),
  )

  export const selectAllInfo = createMemoizedSelector(
    selectBounds,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    BiologySelectors.selectMetatype,
    (bounds, entity, metatypeName): Required<EntityAttributeCatalog> => {
      const allAttrs = Object.values(AttributeKey) as AttributeKey[]

      const attrCatalog = Object.fromEntries(
        allAttrs.map((attrKey) => {
          const baseBounds = bounds[attrKey] ?? {
            attr: attrKey,
            min: 0,
            max: 0,
            augMax: 0,
          }

          const base = selectBase({ entity }, { key: attrKey })
          const value = selectValue({ entity }, { key: attrKey })

          const catalogEntry = {
            ...baseBounds,
            base: base,
            baseValue: base,
            value: value,
            current: value,
          } satisfies EntityAttributeInfo

          return [attrKey, catalogEntry]
        }),
      ) as Required<EntityAttributeCatalog>

      attrCatalog[AttributeKey.essence].computed = true

      if (metatypeName === MetatypeType.AI) {
        attrCatalog[AttributeKey.signal].computed = true
        attrCatalog[AttributeKey.response].computed = true
        attrCatalog[AttributeKey.system].computed = true
        attrCatalog[AttributeKey.firewall].computed = true
        attrCatalog[AttributeKey.edge].max = AiAttrFormulas.getRating({
          charisma: attrCatalog[AttributeKey.charisma].value,
          intuition: attrCatalog[AttributeKey.intuition].value,
          logic: attrCatalog[AttributeKey.logic].value,
          willpower: attrCatalog[AttributeKey.willpower].value,
        })
      }

      Object.keys(attrCatalog).forEach((attrKey) => {
        const attr = attrCatalog[attrKey as AttributeKey]
        if (!attr.augMax || attr.augMax <= attr.max) {
          attr.augMax = attr.max
        }
      })

      return attrCatalog
    },
  )

  export const selectAll = createMemoizedSelector(
    selectAllInfo,
    (attrs): AttributeCatalog => Object.fromEntries(
      Object.entries(attrs).map(([key, info]) => [key, info.value]),
    ),
  )

  export const selectInfo = createMemoizedSelector(
    selectAllInfo,
    SelectorOptions.key.attr,
    (allInfo, key) => allInfo[key] ?? {
      min: 0,
      max: 0,
      augMax: 0,
    },
  )

  export const selectHasMaxxed = createMemoizedSelector(
    selectAllInfo,
    (attrs) => Object.values(attrs)
      .filter((info) => !info.computed)
      .map((info) => ({ max: Math.max(info.max), value: info.value ?? 0 }))
      .filter(({ max, value }) => max >= 1 && value >= 1)
      .some((info) => info.value >= info.max),
  )
}
