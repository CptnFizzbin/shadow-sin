import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerState } from "#/lib/stores/runner/runnerState.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectSprites(state: RunnerData): SpriteData[] {
  return state.sprites
}

const legacy = { selectSprites }

/** Standardized, namespaced selectors for the Sprites domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace SpritesSelectors {
  export const selectAll: Selector<RunnerState, SpriteData[]> = (state) => legacy.selectSprites(state.runner)
}
