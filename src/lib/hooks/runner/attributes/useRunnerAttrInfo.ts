import type { RunnerAttrInfo } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

export type { RunnerAttrInfo }

/**
 * Returns bounds and values for every attribute, derived from the runner's metatype/awakening
 * type and stored attribute values. Unlike attribute values on their own (see
 * `useEntitySelector`/`AttrSelectors`), these bounds are always the Runner's own — a
 * metatype/awakening-derived concept with no "nearest entity" equivalent for devices, spirits, or
 * sprites.
 * @deprecated Use `AttrSelectors.selectAllInfo` via `useRunnerSelector` instead.
 */
export const useAllRunnerAttrInfos = (): Record<AttributeKey, RunnerAttrInfo> => {
  return useRunnerSelector(AttrSelectors.selectAllInfo)
}

/**
 * Returns bounds and values for the given attribute, derived from the runner's metatype/awakening
 * type and stored attribute value.
 * @deprecated Use `AttrSelectors.selectInfo` via `useRunnerSelector` instead.
 */
export const useRunnerAttrInfo = (attr: AttributeKey): RunnerAttrInfo => {
  return useRunnerSelector(AttrSelectors.selectInfo, { key: attr })
}
