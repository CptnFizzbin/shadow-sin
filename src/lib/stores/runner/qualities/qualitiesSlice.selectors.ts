import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { QualityData } from "#/system/qualityData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectQualities(state: RunnerData): QualityData[] {
  return state.qualities
}

const legacy = { selectQualities }

/** Standardized, namespaced selectors for the Qualities domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace QualitiesSelectors {
  export const selectAll: Selector<{ runner: RunnerData }, QualityData[]> = (state) => legacy.selectQualities(state.runner)
}
