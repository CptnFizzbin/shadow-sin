import { DamageSelectors } from "#/stores/runner/damage/damageSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

/** @deprecated Use {@link DamageSelectors.selectWoundMod} via `useRunnerSelector` instead. */
export function useWoundModifier() {
  return useRunnerSelector(DamageSelectors.selectWoundMod)
}
