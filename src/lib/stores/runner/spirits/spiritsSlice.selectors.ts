import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** `TState` for the namespace below — file-local, same pattern as `AttrState` in
 *  `attributesSlice.selectors.ts`, not a shared cross-file helper. */
interface RunnerState {
  runner: RunnerData
}

export function selectSpirits(state: RunnerData): SpiritData[] {
  return state.spirits
}

const legacy = { selectSpirits }

/** Standardized, namespaced selectors for the Spirits domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace SpiritsSelectors {
  export const selectAll: Selector<RunnerState, SpiritData[]> = (state) => legacy.selectSpirits(state.runner)
}
