import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Spirits domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace SpiritsSelectors {
  export type SpiritsSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.spirits,
  ) satisfies SpiritsSelector<SpiritData[]>
}
