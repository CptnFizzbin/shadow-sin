import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { AwakeningData } from "#/system/awakeningType.ts"
import { awakenings } from "#/system/awakeningType.ts"
import type { MetatypeData } from "#/system/metatypeData.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** `TState` for the namespace below — file-local, same pattern as `AttrState` in
 *  `attributesSlice.selectors.ts`, not a shared cross-file helper. */
interface RunnerState {
  runner: RunnerData
}

export function selectBiology(state: RunnerData): RunnerData["biology"] {
  return state.biology
}

export function selectMetatype(state: RunnerData): RunnerData["biology"]["metatype"] {
  return state.biology.metatype
}

export function selectAwakening(state: RunnerData): RunnerData["biology"]["awakening"] {
  return state.biology.awakening
}

/** Denormalized {@link MetatypeData} looked up via {@link selectMetatype}. */
export const selectMetatypeData: (state: RunnerData) => MetatypeData = createSelector(
  selectMetatype,
  (metatype) => metatypes[metatype],
)

/** Denormalized {@link AwakeningData} looked up via {@link selectAwakening}. */
export const selectAwakeningData: (state: RunnerData) => AwakeningData = createSelector(
  selectAwakening,
  (awakening) => awakenings[awakening],
)

const legacy = {
  selectBiology,
  selectMetatype,
  selectAwakening,
  selectMetatypeData,
  selectAwakeningData,
}

/** Standardized, namespaced selectors for the Biology domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace BiologySelectors {
  export const select: Selector<RunnerState, RunnerData["biology"]> = (state) => legacy.selectBiology(state.runner)
  export const selectMetatype: Selector<RunnerState, RunnerData["biology"]["metatype"]> = (state) =>
    legacy.selectMetatype(state.runner)
  export const selectAwakening: Selector<RunnerState, RunnerData["biology"]["awakening"]> = (state) =>
    legacy.selectAwakening(state.runner)
  export const selectMetatypeInfo: Selector<RunnerState, MetatypeData> = (state) =>
    legacy.selectMetatypeData(state.runner)
  export const selectAwakeningInfo: Selector<RunnerState, AwakeningData> = (state) =>
    legacy.selectAwakeningData(state.runner)
}
