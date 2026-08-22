import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Initiative domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace InitiativeSelectors {
  export type InitiativeSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const selectPassesCompleted = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => new Set(runner.initiative?.passesCompleted ?? []),
  ) satisfies InitiativeSelector<ReadonlySet<number>>

  export const selectRolledResults = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.initiative?.rolledResults,
  ) satisfies InitiativeSelector<number[] | undefined>

  export const selectGoingFirst = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.initiative?.goingFirst ?? false,
  ) satisfies InitiativeSelector<boolean>

  export const selectExtraPasses = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.initiative?.extraPasses ?? 0,
  ) satisfies InitiativeSelector<number>
}
