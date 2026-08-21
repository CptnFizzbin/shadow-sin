import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityWithAttrs } from "#/system/entities/traits/entityWithAttrs.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectAttributes(state: RunnerData): RunnerData["attributes"] {
  return state.attributes
}

/** The raw stored value for `key`, or `0` if unset — never includes derived modifiers. */
export function selectAttrBase(key: AttributeKey) {
  return (state: RunnerData): number => state.attributes[key] ?? 0
}

/** The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable. */
export function selectAttrValue(key: AttributeKey) {
  return (state: RunnerData): number => selectAttrBase(key)(state)
}

/**
 * Standardized, namespaced selectors for the Attributes domain — see
 * docs/adr/0014-selector-input-decomposition.md. Bound to `EntityWithAttrs`
 * (`system/entities/traits/entityWithAttrs.ts`) rather than `RunnerData` directly:
 * `RunnerData.attributes` already structurally satisfies that shape today, so this domain gets
 * cross-entity reuse for free, ahead of any Entity kind formally implementing the trait. Wraps
 * the legacy exports above; existing call sites are unaffected.
 */
export namespace AttrSelectors {
  export const selectAll: Selector<EntityWithAttrs, EntityWithAttrs["attributes"]> = (state) => state.attributes

  /** The raw stored value for `key`, or `0` if unset — never includes derived modifiers. */
  export const selectBase: Selector<EntityWithAttrs, number, { key: AttributeKey }> = createSelector(
    [
      (state: EntityWithAttrs) => state.attributes,
      (_state: EntityWithAttrs, options: { key: AttributeKey }) => options.key,
    ],
    (attributes, key) => attributes[key] ?? 0,
  )

  /** The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable. */
  export const selectValue: Selector<EntityWithAttrs, number, { key: AttributeKey }> = createSelector(
    [
      selectBase,
    ],
    (base) => base,
  )
}
