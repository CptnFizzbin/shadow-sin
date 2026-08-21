import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityWithAttrs } from "#/system/entities/traits/entityWithAttrs.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `AttrSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectAttributes(state: RunnerData): RunnerData["attributes"] {
  return state.attributes
}

/**
 * The raw stored value for `key`, or `0` if unset — never includes derived modifiers.
 * @deprecated Use `AttrSelectors.selectBase` via `useRunnerSelector` instead.
 */
export function selectAttrBase(key: AttributeKey) {
  return (state: RunnerData): number => state.attributes[key] ?? 0
}

/**
 * The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable.
 * @deprecated Use `AttrSelectors.selectValue` via `useRunnerSelector` instead.
 */
export function selectAttrValue(key: AttributeKey) {
  return (state: RunnerData): number => selectAttrBase(key)(state)
}

/**
 * Standardized, namespaced selectors for the Attributes domain — see
 * docs/adr/0014-selector-input-decomposition.md. `TState` is the inline object type
 * `{ entity: EntityWithAttrs }` rather than `{ runner: RunnerData }`: `RunnerData.attributes`
 * already structurally satisfies `EntityWithAttrs` (`system/entities/traits/entityWithAttrs.ts`)
 * today, so this domain gets cross-entity reuse for free, ahead of any Entity kind formally
 * implementing the trait. `useRunnerSelector` (`runnerStore.selectors.ts`) assembles the
 * `{ entity: runner }` these selectors need automatically, alongside every other domain's
 * `{ runner: ... }`/`{ items: ... }` shapes — a call site never assembles this by hand. Wraps the
 * legacy exports above; existing call sites are unaffected.
 */
export namespace AttrSelectors {
  export const selectAll: Selector<{ entity: EntityWithAttrs }, EntityWithAttrs["attributes"]> =
    (state) => state.entity.attributes

  /** The raw stored value for `key`, or `0` if unset — never includes derived modifiers. */
  export const selectBase: Selector<{ entity: EntityWithAttrs }, number, { key: AttributeKey }> = createSelector(
    [
      (state: { entity: EntityWithAttrs }) => state.entity.attributes,
      (_state: { entity: EntityWithAttrs }, options: { key: AttributeKey }) => options.key,
    ],
    (attributes, key) => attributes[key] ?? 0,
  )

  /** The effective value for `key` used in tests and dice pools, or `0` if unset or inapplicable. */
  export const selectValue: Selector<{ entity: EntityWithAttrs }, number, { key: AttributeKey }> = createSelector(
    [
      selectBase,
    ],
    (base) => base,
  )
}
