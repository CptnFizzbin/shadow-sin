import { createSelector } from "reselect"

import type { EntityState, Selector } from "#/integrations/reselect/selectorUtils.ts"
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
 * docs/adr/0014-selector-input-decomposition.md. `TState` is `EntityState<EntityWithAttrs>`
 * (`{ entity: EntityWithAttrs }`) rather than `{ runner: RunnerData }`:
 * `RunnerData.attributes` already structurally satisfies `EntityWithAttrs`
 * (`system/entities/traits/entityWithAttrs.ts`) today, so this domain gets cross-entity reuse for
 * free, ahead of any Entity kind formally implementing the trait — a caller just passes
 * `{ entity: runner }`. Wraps the legacy exports above; existing call sites are unaffected.
 */
export namespace AttrSelectors {
  export const selectAll: Selector<EntityState<EntityWithAttrs>, EntityWithAttrs["attributes"]> = (state) =>
    state.entity.attributes

  /** The raw stored value for `key`, or `0` if unset — never includes derived modifiers. */
  export const selectBase: Selector<EntityState<EntityWithAttrs>, number, { key: AttributeKey }> = createSelector(
    [
      (state: EntityState<EntityWithAttrs>) => state.entity.attributes,
      (_state: EntityState<EntityWithAttrs>, options: { key: AttributeKey }) => options.key,
    ],
    (attributes, key) => attributes[key] ?? 0,
  )

  /** The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable. */
  export const selectValue: Selector<EntityState<EntityWithAttrs>, number, { key: AttributeKey }> = createSelector(
    [
      selectBase,
    ],
    (base) => base,
  )
}
