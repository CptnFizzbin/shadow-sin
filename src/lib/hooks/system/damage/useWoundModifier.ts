import { DamageSelectors } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

/** @deprecated Use {@link DamageSelectors.selectWoundMod} via `useRunnerSelector` instead. */
export function useWoundModifier() {
  return useRunnerSelector(DamageSelectors.selectWoundMod)
}
