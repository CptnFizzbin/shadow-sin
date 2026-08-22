import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `KarmaSelectors.select` via `useRunnerSelector` instead. */
export function selectKarma(runner: RunnerData): RunnerData["karma"] {
  return mapToLegacySelector(runner, KarmaSelectors.select)
}

/** @deprecated Use `KarmaSelectors.selectCurrent` via `useRunnerSelector` instead. */
export function selectCurrentKarma(runner: RunnerData): number {
  return mapToLegacySelector(runner, KarmaSelectors.selectCurrent)
}

/** @deprecated Use `KarmaSelectors.selectTotal` via `useRunnerSelector` instead. */
export function selectTotalKarma(runner: RunnerData): number {
  return mapToLegacySelector(runner, KarmaSelectors.selectTotal)
}

/** Standardized, namespaced selectors for the Karma domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace KarmaSelectors {
  export type KarmaSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.karma,
  ) satisfies KarmaSelector<RunnerData["karma"]>

  export const selectCurrent = createMemoizedSelector(
    select,
    (karma) => karma.current,
  ) satisfies KarmaSelector<number>

  export const selectTotal = createMemoizedSelector(
    select,
    (karma) => karma.total,
  ) satisfies KarmaSelector<number>
}
