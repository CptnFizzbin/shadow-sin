import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `SpellsSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectSpells(runner: RunnerData): SpellData[] {
  return mapToLegacySelector(runner, SpellsSelectors.selectAll)
}

/** Standardized, namespaced selectors for the Spells domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace SpellsSelectors {
  export type SpellsSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.spells,
  ) satisfies SpellsSelector<SpellData[]>
}
