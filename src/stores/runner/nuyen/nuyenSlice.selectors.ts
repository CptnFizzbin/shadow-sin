import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `NuyenSelectors.select` via `useRunnerSelector` instead. */
export function selectNuyen(runner: RunnerData): RunnerData["nuyen"] {
  return mapToLegacySelector(runner, NuyenSelectors.select)
}

/** @deprecated Use `NuyenSelectors.selectAmount` via `useRunnerSelector` instead. */
export function selectNuyenAmount(runner: RunnerData): number {
  return mapToLegacySelector(runner, NuyenSelectors.selectAmount)
}

/** @deprecated Use `NuyenSelectors.selectLoans` via `useRunnerSelector` instead. */
export function selectLoans(runner: RunnerData): RunnerData["nuyen"]["loans"] {
  return mapToLegacySelector(runner, NuyenSelectors.selectLoans)
}

export namespace NuyenSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.nuyen,
  )

  export const selectAmount = createMemoizedSelector(
    select,
    (nuyen) => nuyen.current,
  )

  export const selectLoans = createMemoizedSelector(
    select,
    (nuyen) => nuyen.loans,
  )
}
