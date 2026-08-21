import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Initiative domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace InitiativeSelectors {
  export const selectPassesCompleted: Selector<{ runner: RunnerData }, ReadonlySet<number>> = (state) =>
    new Set(state.runner.initiative?.passesCompleted ?? [])

  export const selectRolledResults: Selector<{ runner: RunnerData }, number[] | undefined> = (state) =>
    state.runner.initiative?.rolledResults

  export const selectGoingFirst: Selector<{ runner: RunnerData }, boolean> = (state) =>
    state.runner.initiative?.goingFirst ?? false

  export const selectExtraPasses: Selector<{ runner: RunnerData }, number> = (state) =>
    state.runner.initiative?.extraPasses ?? 0
}
