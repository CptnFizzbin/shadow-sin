import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Complex Forms domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace ComplexFormsSelectors {
  export type ComplexFormsSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.complexForms,
  ) satisfies ComplexFormsSelector<ComplexFormData[]>
}
