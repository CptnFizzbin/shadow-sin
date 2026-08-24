import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `SpellsSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectSpells(runner: RunnerData): SpellData[] {
  return mapToLegacySelector(runner, SpellsSelectors.selectAll)
}

export namespace SpellsSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.spells,
  )
}
