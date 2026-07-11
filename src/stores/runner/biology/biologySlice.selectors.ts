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
