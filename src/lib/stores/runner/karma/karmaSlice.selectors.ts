import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectKarma(state: RunnerData): RunnerData["karma"] {
  return state.karma
}

export function selectCurrentKarma(state: RunnerData): number {
  return state.karma.current
}

export function selectTotalKarma(state: RunnerData): number {
  return state.karma.total
}

const legacy = { selectKarma, selectCurrentKarma, selectTotalKarma }

/** Standardized, namespaced selectors for the Karma domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace KarmaSelectors {
  export const select: Selector<{ runner: RunnerData }, RunnerData["karma"]> = (state) => legacy.selectKarma(state.runner)
  export const selectCurrent: Selector<{ runner: RunnerData }, number> = (state) => legacy.selectCurrentKarma(state.runner)
  export const selectTotal: Selector<{ runner: RunnerData }, number> = (state) => legacy.selectTotalKarma(state.runner)
}
