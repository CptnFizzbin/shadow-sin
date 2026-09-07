import { createAttrInfo } from "#/components/runner/attributes/attributeInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { MatrixSelectors } from "#/stores/runner/gameState/matrix/matrixSlice.selectors.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { AttributeInfo, EntityAttributeInfo } from "#/system/attributeInfo.ts"
import { AiAttributes, AttributeKey, AttributeOrder, PhysicalAttributes } from "#/system/attributeKey.ts"
import { AiAttrFormulas } from "#/system/attributes/aiAttrFormulas.ts"
import type {
  AttributeCatalog,
  AttributeInfoCatalog,
  EntityAttributeCatalog,
} from "#/system/attributes/attributeCatalog.ts"
import { MagicAwakeningTypes, TechAwakeningTypes } from "#/system/awakeningType.ts"
import type { EntityBase, EntityWithAttrs } from "#/system/entities/entityTraits.ts"
import { isEntityWithAttrs } from "#/system/entities/entityTraits.ts"
import { isMatrixNode } from "#/system/matrix/matrixNodeData.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { isRunnerWithBiology } from "#/system/runnerTraits.ts"

/**
 * {@link AttributeInfo} bounds plus the runner's own base (raw stored) and current (effective)
 * values for one attribute.
 */
export interface RunnerAttrInfo extends AttributeInfo {
  base: number
  current: number
}

/** {@link RunnerAttrInfo}-shaped row from {@link AttrSelectors.selectActive}, plus whether it's
 *  one of the AI-only computed stats (Rating/System/Firewall/Response/Signal) rather than a
 *  stored, purchasable value — see {@link AiAttributes}. Consumers that deal in BP/Karma cost or
 *  raise eligibility (`useAttributesBuildPoints`, `useHasMaxxedAttribute`,
 *  `ImprovementAttributeList`) must filter these out; they're never purchasable. */
interface ActiveAttrInfo {
  attr: AttributeKey
  value: number
  min: number
  max: number
  augMax: number
  computed?: boolean
}

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
    SelectorOptions.attributeKey,
    (attributes, key) => attributes[key] ?? 0,
  )

  /** The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable. */
  export const selectValue = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    selectAllRaw,
    SelectorOptions.attributeKey,
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

  /**
   * Bounds (`min`/`max`/`augMax`) for every attribute, derived from the runner's metatype and
   * awakening type — always the Runner's own, regardless of `EntityProvider` nesting; there's no
   * "nearest entity" equivalent for a device, spirit, or sprite.
   */
  export const selectBounds = createMemoizedSelector(
    BiologySelectors.selectMetatypeInfo,
    BiologySelectors.selectAwakeningInfo,
    (metatype, awakening): AttributeInfoCatalog => ({
      ...metatype.attributes,
      ...awakening.attributes,
    }),
  )

  /** {@link RunnerAttrInfo} for every attribute the runner's metatype/awakening defines bounds for.
   *  For an AI Runner, Edge's `max`/`augMax` are overridden live to the AI's computed Rating (SR4A/
   *  Unwired: Edge's natural max equals Rating) rather than the metatype table's flat value. */
  export const selectAllInfo = createMemoizedSelector(
    selectBounds,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    BiologySelectors.selectMetatype,
    (bounds, entity, metatypeName): Required<EntityAttributeCatalog> => {
      const allAttrs = Object.values(AttributeKey) as AttributeKey[]

      const attrCatalog = Object.fromEntries(
        allAttrs.map((attrKey) => {
          const baseBounds = bounds[attrKey] ?? {
            min: 0,
            max: 0,
            augMax: 0,
          }

          const catalogEntry = {
            ...baseBounds,
            base: selectBase({ entity }, { key: attrKey }),
            current: selectValue({ entity }, { key: attrKey }),
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
          charisma: attrCatalog[AttributeKey.charisma].current,
          intuition: attrCatalog[AttributeKey.intuition].current,
          logic: attrCatalog[AttributeKey.logic].current,
          willpower: attrCatalog[AttributeKey.willpower].current,
        })
      }

      return attrCatalog
    },
  )

  export const selectAll = createMemoizedSelector(
    selectAllInfo,
    (attrs): AttributeCatalog => Object.fromEntries(
      Object.entries(attrs).map(([key, info]) => [key, info.current]),
    ),
  )

  /** {@link RunnerAttrInfo} for `key`. */
  export const selectInfo = createMemoizedSelector(
    selectAllInfo,
    SelectorOptions.attributeKey,
    (allInfo, key) => allInfo[key] ?? {
      min: 0,
      max: 0,
      augMax: 0,
    },
  )

  // TODO: compare against `selectAllInfo`/`selectBounds` for overlapping logic/scope — this filters
  // down to only the "active" attributes (drops essence; drops magic/resonance when the runner's
  // awakening type doesn't grant them; drops Physical attributes and adds the AI-only computed
  // rows for an AI Runner) and returns them ordered as an array, whereas `selectAllInfo` returns
  // every bounded attribute keyed by `AttributeKey` with no such filtering.
  /**
   * {@link ActiveAttrInfo} for each attribute the runner actively has, in {@link AttributeOrder}
   * plus (for an AI Runner only) {@link AiAttributes} on top. Most rows are purchasable/raisable;
   * AI's Rating/System/Firewall/Response/Signal rows are `computed: true` instead — live values,
   * never stored or costed. Historically `AttributeOrder` itself (not `Object.values(AttributeKey)`)
   * excluded the four Matrix stats entirely, since they weren't Runner attribute rows (see #438);
   * AI is the deliberate exception, added on top here rather than into `AttributeOrder` itself,
   * since that constant is also consumed by AI-unaware code (the header summary, the Initiative
   * Tracker's Combatant form) that must not suddenly render these rows for every Runner/combatant.
   */
  export const selectActive = createMemoizedSelector(
    selectAll,
    BiologySelectors.selectMetatypeInfo,
    BiologySelectors.selectAwakeningInfo,
    MatrixSelectors.selectActiveNode,
    (attributes, metatype, awakening, activeNode): ActiveAttrInfo[] => {
      const isAi = metatype.name === MetatypeType.AI

      return [...AttributeOrder, ...AiAttributes]
        .filter((attr) => {
          if (attr === AttributeKey.essence) return false
          if (attr === AttributeKey.magic) return MagicAwakeningTypes.includes(awakening.name)
          if (attr === AttributeKey.resonance) return TechAwakeningTypes.includes(awakening.name)
          if (AiAttributes.includes(attr)) return isAi
          if (PhysicalAttributes.includes(attr)) return !isAi
          return true
        })
        .map((attr): ActiveAttrInfo => {
          if (isAi && AiAttributes.includes(attr)) {
            const value = getAiComputedValue(attr, attributes, activeNode)
            return { attr, value, min: value, max: value, augMax: value, computed: true }
          }

          const info = createAttrInfo({ attr, value: attributes[attr] ?? 0, metatype, awakening })

          const edgeMaxOverride = AiAttrFormulas.getEdgeMaxOverride(attr, metatype.name, attributes)
          if (edgeMaxOverride !== undefined) {
            return { ...info, max: edgeMaxOverride, augMax: edgeMaxOverride }
          }

          return info
        })
    },
  )

  /** The live computed value for one of AI's Rating/System/Firewall/Response/Signal rows — `0`
   *  for any other key, or for a non-AI Runner. Backed by {@link selectActive} so a caller (e.g.
   *  a single {@link AttributeRow}) doesn't need to re-derive the Formula/Active-Node lookup
   *  itself. */
  export const selectComputedValue = createMemoizedSelector(
    selectActive,
    SelectorOptions.attributeKey,
    (active, key) => active.find((attrInfo) => attrInfo.attr === key)?.value ?? 0,
  )
}

/** SR4A/Unwired formulas for AI's computed attributes, plus Response/Signal borrowed live from
 *  the Runner's current Active Node (no stored "home node" yet — see CONTEXT.md's **Rating**
 *  entry for the naming note and the deferred-scope explanation). */
function getAiComputedValue(
  attr: AttributeKey,
  attributes: AttributeCatalog,
  activeNode: ReturnType<typeof MatrixSelectors.selectActiveNode>,
): number {
  switch (attr) {
    case AttributeKey.rating:
      return AiAttrFormulas.getRatingFromAttributes(attributes)
    case AttributeKey.system:
      return AiAttrFormulas.getSystem(attributes.intuition ?? 0, attributes.logic ?? 0)
    case AttributeKey.firewall:
      return AiAttrFormulas.getFirewall(attributes.willpower ?? 0, attributes.charisma ?? 0)
    case AttributeKey.response:
      return activeNode?.matrix[AttributeKey.response] ?? 0
    case AttributeKey.signal:
      return activeNode?.matrix[AttributeKey.signal] ?? 0
    default:
      return 0
  }
}
