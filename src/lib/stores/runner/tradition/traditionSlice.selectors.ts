import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"

export namespace TraditionSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.tradition,
  )
}
