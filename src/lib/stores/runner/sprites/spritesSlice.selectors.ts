import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Sprites domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace SpritesSelectors {
  export const selectAll: Selector<{ runner: RunnerData }, SpriteData[]> = (state) => state.runner.sprites
}
