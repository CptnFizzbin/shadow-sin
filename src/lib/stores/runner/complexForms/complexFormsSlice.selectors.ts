import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Complex Forms domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace ComplexFormsSelectors {
  export const selectAll: Selector<{ runner: RunnerData }, ComplexFormData[]> = (state) => state.runner.complexForms
}
