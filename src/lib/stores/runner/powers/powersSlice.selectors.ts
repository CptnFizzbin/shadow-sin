import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `PowersSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectPowers(runner: RunnerData): AdeptPowerData[] {
  return mapToLegacySelector(runner, PowersSelectors.selectAll)
}

export namespace PowersSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.powers,
  )
}
