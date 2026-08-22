import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `MetaSelectors.selectLastExportDate` via `useRunnerSelector` instead. */
export function selectLastExportDate(runner: RunnerData): RunnerData["_meta_"]["lastExportDate"] {
  return mapToLegacySelector(runner, MetaSelectors.selectLastExportDate)
}

/** Standardized, namespaced selectors for the Meta domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace MetaSelectors {
  export type MetaSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const selectLastExportDate = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner._meta_.lastExportDate,
  ) satisfies MetaSelector<RunnerData["_meta_"]["lastExportDate"]>
}
