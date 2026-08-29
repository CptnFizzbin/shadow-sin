import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

export namespace NuyenSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.nuyen,
  )

  export const selectAmount = createMemoizedSelector(
    select,
    (nuyen) => nuyen.current,
  )

  export const selectLoans = createMemoizedSelector(
    select,
    (nuyen) => nuyen.loans,
  )
}
