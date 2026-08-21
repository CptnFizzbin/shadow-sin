import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerState } from "#/lib/stores/runner/runnerState.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectSpells(state: RunnerData): SpellData[] {
  return state.spells
}

const legacy = { selectSpells }

/** Standardized, namespaced selectors for the Spells domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace SpellsSelectors {
  export const selectAll: Selector<RunnerState, SpellData[]> = (state) => legacy.selectSpells(state.runner)
}
