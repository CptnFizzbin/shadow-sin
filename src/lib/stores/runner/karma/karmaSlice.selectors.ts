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

/**
 * @deprecated Use `useRunnerSelector(({ magicAdvancement }) => magicAdvancement.initiateGrade)`
 * instead — see `docs/adr/0013-unify-runner-state-access.md`.
 */
export function selectInitiateGrade(state: RunnerData): number {
  return state.initiateGrade
}

/**
 * @deprecated Use `useRunnerSelector(({ magicAdvancement }) => magicAdvancement.submersionGrade)`
 * instead — see `docs/adr/0013-unify-runner-state-access.md`.
 */
export function selectSubmersionGrade(state: RunnerData): number {
  return state.submersionGrade
}
