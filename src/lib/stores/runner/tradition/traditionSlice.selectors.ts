import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Tradition domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace TraditionSelectors {
  export const select: Selector<{ runner: RunnerData }, RunnerData["tradition"]> = (state) => state.runner.tradition
}
