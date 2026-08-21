import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectNuyen(state: RunnerData): RunnerData["nuyen"] {
  return state.nuyen
}

export function selectNuyenAmount(state: RunnerData): number {
  return state.nuyen.current
}

export function selectLoans(state: RunnerData): RunnerData["nuyen"]["loans"] {
  return state.nuyen.loans
}

const legacy = { selectNuyen, selectNuyenAmount, selectLoans }

/** Standardized, namespaced selectors for the Nuyen domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace NuyenSelectors {
  export const select: Selector<RunnerData, RunnerData["nuyen"]> = (state) => legacy.selectNuyen(state)
  export const selectAmount: Selector<RunnerData, number> = (state) => legacy.selectNuyenAmount(state)
  export const selectLoans: Selector<RunnerData, RunnerData["nuyen"]["loans"]> = (state) =>
    legacy.selectLoans(state)
}
