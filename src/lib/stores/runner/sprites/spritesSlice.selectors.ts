import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Sprites domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace SpritesSelectors {
  export type SpritesSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.sprites,
  ) satisfies SpritesSelector<SpriteData[]>
}
