import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectPowers(state: RunnerData): AdeptPowerData[] {
  return state.powers
}

const legacy = { selectPowers }

/** Standardized, namespaced selectors for the Powers domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace PowersSelectors {
  export const selectAll: Selector<RunnerData, AdeptPowerData[]> = (state) => legacy.selectPowers(state)
}
