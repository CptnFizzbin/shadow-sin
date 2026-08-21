import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectLastExportDate(state: RunnerData): RunnerData["_meta_"]["lastExportDate"] {
  return state._meta_.lastExportDate
}

const legacy = { selectLastExportDate }

/** Standardized, namespaced selectors for the Meta domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace MetaSelectors {
  export const selectLastExportDate: Selector<RunnerData, RunnerData["_meta_"]["lastExportDate"]> = (state) =>
    legacy.selectLastExportDate(state)
}
