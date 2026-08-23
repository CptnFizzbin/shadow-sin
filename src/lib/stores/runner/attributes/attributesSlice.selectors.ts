import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption, selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityWithAttrs } from "#/system/entities/entityTraits.ts"
import { isEntityWithAttrs } from "#/system/entities/entityTraits.ts"
import type { EntityData } from "#/system/entityData.ts"
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
    entity: EntityData & EntityWithAttrs
  }, TReturn, TOptions>

  export const Options = {
    key: selectorOption<{ key: AttributeKey }>("key"),
  }

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    (entity) => entity.attributes,
  )

  /** The raw stored value for `key`, or `0` if unset — before modifiers, drugs, or game effects apply. */
  export const selectBase = createMemoizedSelector(
    selectAll,
    Options.key,
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
    (metatype, awakening): Record<AttributeKey, AttributeInfo> => ({
      ...metatype.attributes,
      ...awakening.attributes,
    }),
  )

  /** {@link RunnerAttrInfo} for every attribute the runner's metatype/awakening defines bounds for. */
  export const selectAllInfo = createMemoizedSelector(
    selectBounds,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithAttrs),
    (bounds: Record<AttributeKey, AttributeInfo>, entity): Record<AttributeKey, RunnerAttrInfo> => {
      return Object.fromEntries(
        Object.entries(bounds).map(([key, info]) => [
          key,
          {
            ...info,
            base: selectBase({ entity }, { key: key as AttributeKey }),
            current: selectValue({ entity }, { key: key as AttributeKey }),
          },
        ]),
      ) as Record<AttributeKey, RunnerAttrInfo>
    },
  )

  /** {@link RunnerAttrInfo} for `key`. */
  export const selectInfo = createMemoizedSelector(
    selectAllInfo,
    Options.key,
    (allInfo, key) => allInfo[key],
  )
}
