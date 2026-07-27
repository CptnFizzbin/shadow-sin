import type { RunnerData } from "#/system/runnerData.ts"

export function selectTradition(state: RunnerData): RunnerData["tradition"] {
  return state.tradition
}
