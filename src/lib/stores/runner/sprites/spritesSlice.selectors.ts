import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import { AwakeningType } from "#/system/awakeningType.ts"

export namespace SpriteSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.sprites,
  )

  /** {@link selectAll}, or empty for a runner who isn't a Technomancer. */
  export const selectVisible = createMemoizedSelector(
    BiologySelectors.selectAwakening,
    selectAll,
    (awakening, sprites) => awakening === AwakeningType.Technomancer ? sprites : [],
  )
}
