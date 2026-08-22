import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption, selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityBase, EntityWithAttrs } from "#/system/entities/entityTraits.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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

  export const Options = {
    key: selectorOption<{ key: AttributeKey }>("key"),
  }

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait<EntityWithAttrs>(),
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
}
