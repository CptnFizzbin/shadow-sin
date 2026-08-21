import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** `TState` for the namespace below — file-local, same pattern as `AttrState` in
 *  `attributesSlice.selectors.ts`, not a shared cross-file helper. */
interface RunnerState {
  runner: RunnerData
}

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
  export const selectPassesCompleted: Selector<RunnerState, ReadonlySet<number>> = (state) =>
    legacy.selectPassesCompleted(state.runner)
  export const selectRolledResults: Selector<RunnerState, number[] | undefined> = (state) =>
    legacy.selectRolledResults(state.runner)
  export const selectGoingFirst: Selector<RunnerState, boolean> = (state) => legacy.selectGoingFirst(state.runner)
  export const selectExtraPasses: Selector<RunnerState, number> = (state) =>
    legacy.selectExtraPasses(state.runner)
}
