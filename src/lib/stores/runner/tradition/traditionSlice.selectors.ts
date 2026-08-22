import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Standardized, namespaced selectors for the Tradition domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace TraditionSelectors {
  export type TraditionSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.tradition,
  ) satisfies TraditionSelector<RunnerData["tradition"]>
}
