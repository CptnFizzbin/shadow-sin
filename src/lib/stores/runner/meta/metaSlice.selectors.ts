import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
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
