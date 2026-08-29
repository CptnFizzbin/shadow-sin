import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

export namespace PowersSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.powers,
  )

  /** Power points spent across every staged Adept Power, summed as `costPerRating * rating`. */
  export const selectUsed = createMemoizedSelector(
    selectAll,
    (powers) => powers.reduce((total, power) => total + power.costPerRating * power.rating, 0),
  )
}
