import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

export namespace KarmaSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.karma,
  )

  export const selectCurrent = createMemoizedSelector(
    select,
    (karma) => karma.current,
  )

  export const selectTotal = createMemoizedSelector(
    select,
    (karma) => karma.total,
  )
}
