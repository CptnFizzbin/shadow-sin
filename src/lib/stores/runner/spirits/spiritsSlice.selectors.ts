import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Spirits domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace SpiritsSelectors {
  export const selectAll: Selector<{ runner: RunnerData }, SpiritData[]> = (state) => state.runner.spirits
}
