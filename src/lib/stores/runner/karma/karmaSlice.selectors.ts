import type { RunnerData } from "#/system/runnerData.ts"

export function selectKarma(state: RunnerData): RunnerData["karma"] {
  return state.karma
}

export function selectCurrentKarma(state: RunnerData): number {
  return state.karma.current
}

export function selectTotalKarma(state: RunnerData): number {
  return state.karma.total
}
