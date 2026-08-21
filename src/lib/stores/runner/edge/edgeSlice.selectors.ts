import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { selectAttrBase } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** `TState` for the namespace below — file-local, same pattern as `AttrState` in
 *  `attributesSlice.selectors.ts`, not a shared cross-file helper. */
interface RunnerState {
  runner: RunnerData
}

export function selectEdgeMax(state: RunnerData): number {
  return selectAttrBase(AttributeKey.edge)(state)
}

export function selectEdgeCurrent(state: RunnerData): number {
  return state.edge.current
}

const legacy = { selectEdgeMax, selectEdgeCurrent }

/** Standardized, namespaced selectors for the Edge domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace EdgeSelectors {
  export const selectMax: Selector<RunnerState, number> = (state) => legacy.selectEdgeMax(state.runner)
  export const selectCurrent: Selector<RunnerState, number> = (state) => legacy.selectEdgeCurrent(state.runner)
}
