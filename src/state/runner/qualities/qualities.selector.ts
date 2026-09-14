import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"

export namespace QualitiesSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.qualities,
  )
}
