import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { MatrixSelectors } from "#/stores/runner/gameState/matrix/matrixSlice.selectors.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { EntityAttributeInfo } from "#/system/attributeInfo.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AiAttrFormulas } from "#/system/attributes/aiAttrFormulas.ts"
import type {
  AttributeCatalog,
  AttributeInfoCatalog,
  EntityAttributeCatalog,
} from "#/system/attributes/attributeCatalog.ts"
import type { EntityBase, EntityWithAttrs } from "#/system/entities/entityTraits.ts"
import { isEntityWithAttrs } from "#/system/entities/entityTraits.ts"
import { isMatrixNode } from "#/system/matrix/matrixNodeData.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { isRunnerWithBiology } from "#/system/runnerTraits.ts"

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

  /** The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable. */
  export const selectValue = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    selectAllRaw,
    SelectorOptions.key.attr,
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
            return AiAttrFormulas.getResponse({ willpower: attrs[AttributeKey.willpower] ?? 0 })
          case AttributeKey.signal:
            return AiAttrFormulas.getSignal({ charisma: attrs[AttributeKey.charisma] ?? 0 })
          case AttributeKey.system:
            if (!activeNode) return 0
            return AttrSelectors.selectValue({ entity: activeNode }, { key: AttributeKey.system })
          case AttributeKey.firewall:
            if (!activeNode) return 0
            return AttrSelectors.selectValue({ entity: activeNode }, { key: AttributeKey.firewall })
          default:
            return attrs[attr] ?? 0
        }
      }

      return attrs[attr] ?? 0
    },
  )

  export const forAttr = (attr: AttributeKey) => ({
    selectBase: injectOption(selectBase, { key: attr }),
    selectValue: injectOption(selectValue, { key: attr }),
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
      .map((info) => ({ max: Math.max(info.max), value: info.value ?? 0 }))
      .filter(({ max, value }) => max >= 1 && value >= 1)
      .some((info) => info.value >= info.max),
  )
}
