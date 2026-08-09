import type { AttributeKey } from "#/system/attributeKey.ts"
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
