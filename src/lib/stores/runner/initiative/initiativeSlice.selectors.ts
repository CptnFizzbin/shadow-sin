import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
  export const selectPassesCompleted: Selector<RunnerData, ReadonlySet<number>> = (state) =>
    legacy.selectPassesCompleted(state)
  export const selectRolledResults: Selector<RunnerData, number[] | undefined> = (state) =>
    legacy.selectRolledResults(state)
  export const selectGoingFirst: Selector<RunnerData, boolean> = (state) => legacy.selectGoingFirst(state)
  export const selectExtraPasses: Selector<RunnerData, number> = (state) =>
    legacy.selectExtraPasses(state)
}
