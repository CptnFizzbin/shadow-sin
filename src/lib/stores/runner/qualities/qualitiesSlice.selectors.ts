import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { QualityData } from "#/system/qualityData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Qualities domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace QualitiesSelectors {
  export const selectAll: Selector<{ runner: RunnerData }, QualityData[]> = (state) => state.runner.qualities
}
