import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"

export namespace KarmaSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.karma,
  )

  export const selectCurrent = createMemoizedSelector(
    select,
    (karma) => karma.current,
  )

  export const selectLog = createMemoizedSelector(
    select,
    (karma) => karma.log,
  )

  export const selectTotal = createMemoizedSelector(
    select,
    (karma) => karma.total,
  )
}
