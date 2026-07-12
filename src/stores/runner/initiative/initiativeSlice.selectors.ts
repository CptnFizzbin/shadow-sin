import type { RunnerData } from "#/system/runnerData.ts"

export function selectPassesCompleted(state: RunnerData): ReadonlySet<number> {
  return new Set(state.initiative?.passesCompleted ?? [])
}

export function selectRolledResults(state: RunnerData): number[] | undefined {
  return state.initiative?.rolledResults
}

export function selectGoingFirst(state: RunnerData): boolean {
  return state.initiative?.goingFirst ?? false
}

export function selectExtraPasses(state: RunnerData): number {
  return state.initiative?.extraPasses ?? 0
}
