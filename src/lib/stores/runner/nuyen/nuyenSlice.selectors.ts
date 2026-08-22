import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
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

/** Standardized, namespaced selectors for the Nuyen domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace NuyenSelectors {
  export type NuyenSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.nuyen,
  ) satisfies NuyenSelector<RunnerData["nuyen"]>

  export const selectAmount = createMemoizedSelector(
    select,
    (nuyen) => nuyen.current,
  ) satisfies NuyenSelector<number>

  export const selectLoans = createMemoizedSelector(
    select,
    (nuyen) => nuyen.loans,
  ) satisfies NuyenSelector<RunnerData["nuyen"]["loans"]>
}
