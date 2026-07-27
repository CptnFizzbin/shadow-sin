import { createSelector } from "reselect"

import type { AwakeningData } from "#/system/awakeningType.ts"
import { awakenings } from "#/system/awakeningType.ts"
import type { MetatypeData } from "#/system/metatypeData.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
