import { createAttrInfo } from "#/components/runner/attributes/attributeInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { mapToLegacySelector } from "#/stores/runner/mapToLegacySelector.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import { AttributeKey, AttributeOrder } from "#/system/attributeKey.ts"
import type { AttributeInfoCatalog } from "#/system/attributes/attributeCatalog.ts"
import { MagicAwakeningTypes, TechAwakeningTypes } from "#/system/awakeningType.ts"
import type { EntityBase, EntityWithAttrs } from "#/system/entities/entityTraits.ts"
import { isEntityWithAttrs } from "#/system/entities/entityTraits.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/**
 * {@link AttributeInfo} bounds plus the runner's own base (raw stored) and current (effective)
 * values for one attribute.
 */
export interface RunnerAttrInfo extends AttributeInfo {
  base: number
  current: number
}

/** @deprecated Use `AttrSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectAttributes(runner: RunnerData): RunnerData["attributes"] {
  return mapToLegacySelector(runner, AttrSelectors.selectAll)
}

/**
 * The raw stored value for `key`, or `0` if unset — before modifiers, drugs, or game effects apply.
 * @deprecated Use `AttrSelectors.selectBase` via `useRunnerSelector` instead.
 */
export function selectAttrBase(key: AttributeKey) {
  return (runner: RunnerData): number => {
    return mapToLegacySelector(runner, AttrSelectors.forAttr(key).selectBase)
  }
}

/**
 * The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable.
 * @deprecated Use `AttrSelectors.selectValue` via `useRunnerSelector` instead.
 */
export function selectAttrValue(key: AttributeKey) {
  return (runner: RunnerData): number => {
    return mapToLegacySelector(runner, AttrSelectors.forAttr(key).selectValue)
  }
}

export namespace AttrSelectors {
  export type AttrSelector<TReturn, TOptions extends object | never = never> = Selector<{
    entity: EntityBase & EntityWithAttrs
  }, TReturn, TOptions>

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    (entity) => entity.attributes,
  )

  /** The raw stored value for `key`, or `0` if unset — before modifiers, drugs, or game effects apply. */
  export const selectBase = createMemoizedSelector(
    selectAll,
    SelectorOptions.attributeKey,
    (attributes, key) => attributes[key] ?? 0,
  )

  /** The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable. */
  export const selectValue = selectBase // TODO: apply GameEffects to value

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

  /** {@link RunnerAttrInfo} for every attribute the runner's metatype/awakening defines bounds for. */
  export const selectAllInfo = createMemoizedSelector(
    selectBounds,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    (bounds: AttributeInfoCatalog, entity: EntityWithAttrs): AttributeInfoCatalog => {
      return Object.fromEntries(
        Object.entries(bounds).map(([key, info]) => [
          key,
          {
            ...info,
            base: selectBase({ entity }, { key: key as AttributeKey }),
            current: selectValue({ entity }, { key: key as AttributeKey }),
          },
        ]),
      ) as AttributeInfoCatalog
    },
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
  // awakening type doesn't grant them) and returns them ordered as an array, whereas `selectAllInfo`
  // returns every bounded attribute keyed by `AttributeKey` with no such filtering.
  /** {@link AttributeInfo} for each attribute the runner can actively raise, in {@link AttributeOrder}. */
  export const selectActive = createMemoizedSelector(
    selectAll,
    BiologySelectors.selectMetatypeInfo,
    BiologySelectors.selectAwakeningInfo,
    (attributes, metatype, awakening) => {
      // AttributeOrder — not Object.values(AttributeKey) — excludes the four Matrix stats, which
      // aren't Runner attribute rows (see #438).
      return AttributeOrder
        .filter((attr) => {
          if (attr === AttributeKey.essence) return false
          if (attr === AttributeKey.magic) return MagicAwakeningTypes.includes(awakening.name)
          if (attr === AttributeKey.resonance) return TechAwakeningTypes.includes(awakening.name)
          return true
        })
        .map((attr) => ({ attr, value: attributes[attr] ?? 0 }))
        .map(({ attr, value }) => createAttrInfo({ attr, value, metatype, awakening }))
    },
  )
}
