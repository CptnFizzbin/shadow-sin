import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerState } from "#/lib/stores/runner/runnerState.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
