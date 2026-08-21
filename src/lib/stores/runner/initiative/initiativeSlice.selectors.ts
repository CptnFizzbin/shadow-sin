import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `InitiativeSelectors.selectPassesCompleted` via `useRunnerSelector` instead. */
export function selectPassesCompleted(state: RunnerData): ReadonlySet<number> {
  return new Set(state.initiative?.passesCompleted ?? [])
}

/** @deprecated Use `InitiativeSelectors.selectRolledResults` via `useRunnerSelector` instead. */
export function selectRolledResults(state: RunnerData): number[] | undefined {
  return state.initiative?.rolledResults
}

/** @deprecated Use `InitiativeSelectors.selectGoingFirst` via `useRunnerSelector` instead. */
export function selectGoingFirst(state: RunnerData): boolean {
  return state.initiative?.goingFirst ?? false
}

/** @deprecated Use `InitiativeSelectors.selectExtraPasses` via `useRunnerSelector` instead. */
export function selectExtraPasses(state: RunnerData): number {
  return state.initiative?.extraPasses ?? 0
}

const legacy = {
  selectPassesCompleted,
  selectRolledResults,
  selectGoingFirst,
  selectExtraPasses,
}

/** Standardized, namespaced selectors for the Initiative domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace InitiativeSelectors {
  export const selectPassesCompleted: Selector<{ runner: RunnerData }, ReadonlySet<number>> = (state) =>
    legacy.selectPassesCompleted(state.runner)
  export const selectRolledResults: Selector<{ runner: RunnerData }, number[] | undefined> = (state) =>
    legacy.selectRolledResults(state.runner)
  export const selectGoingFirst: Selector<{ runner: RunnerData }, boolean> = (state) => legacy.selectGoingFirst(state.runner)
  export const selectExtraPasses: Selector<{ runner: RunnerData }, number> = (state) =>
    legacy.selectExtraPasses(state.runner)
}
