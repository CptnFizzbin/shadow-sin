import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectTradition(state: RunnerData): RunnerData["tradition"] {
  return state.tradition
}

const legacy = { selectTradition }

/** Standardized, namespaced selectors for the Tradition domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace TraditionSelectors {
  export const select: Selector<RunnerData, RunnerData["tradition"]> = (state) =>
    legacy.selectTradition(state)
}
