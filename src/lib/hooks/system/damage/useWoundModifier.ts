import { DamageSelectors } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

/** @deprecated - use {@link DamageSelectors.selectWoundMod} instead */
export function useWoundModifier() {
  return useRunnerSelector(DamageSelectors.selectWoundMod)
}
