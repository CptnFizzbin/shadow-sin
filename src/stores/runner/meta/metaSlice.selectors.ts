import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `MetaSelectors.selectLastExportDate` via `useRunnerSelector` instead. */
export function selectLastExportDate(runner: RunnerData): RunnerData["_meta_"]["lastExportDate"] {
  return mapToLegacySelector(runner, MetaSelectors.selectLastExportDate)
}

export namespace MetaSelectors {
  export const selectLastExportDate = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner._meta_.lastExportDate,
  )
}
