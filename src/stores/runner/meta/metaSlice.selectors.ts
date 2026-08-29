import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

export namespace MetaSelectors {
  export const selectLastExportDate = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner._meta_.lastExportDate,
  )
}
