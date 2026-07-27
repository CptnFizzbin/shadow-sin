import type { RunnerData } from "#/system/runnerData.ts"

export function selectNuyen(state: RunnerData): RunnerData["nuyen"] {
  return state.nuyen
}

export function selectNuyenAmount(state: RunnerData): number {
  return state.nuyen.current
}

export function selectLoans(state: RunnerData): RunnerData["nuyen"]["loans"] {
  return state.nuyen.loans
}
