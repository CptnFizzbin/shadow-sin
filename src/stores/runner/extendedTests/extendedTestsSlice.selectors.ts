import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

export namespace ExtendedTestsSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.extendedTests,
  )
}
