import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** `TState` for the namespace below — file-local, same pattern as `AttrState` in
 *  `attributesSlice.selectors.ts`, not a shared cross-file helper. */
interface RunnerState {
  runner: RunnerData
}

export function selectComplexForms(state: RunnerData): ComplexFormData[] {
  return state.complexForms
}

const legacy = { selectComplexForms }

/** Standardized, namespaced selectors for the Complex Forms domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace ComplexFormsSelectors {
  export const selectAll: Selector<RunnerState, ComplexFormData[]> = (state) =>
    legacy.selectComplexForms(state.runner)
}
