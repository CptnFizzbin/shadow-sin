import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"

export namespace InitiativeSelectors {
  export const selectPassesCompleted = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => new Set(runner.initiative?.passesCompleted ?? []),
  )

  export const selectRolledResults = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.initiative?.rolledResults,
  )

  export const selectGoingFirst = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.initiative?.goingFirst ?? false,
  )

  export const selectExtraPasses = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.initiative?.extraPasses ?? 0,
  )
}
