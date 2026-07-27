import { selectTrackWoundModifier } from "#/components/system/damage/damageUtils.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

export function useWoundModifier() {
  return useRunnerStoreSelector((sheet) =>
    selectTrackWoundModifier(DamageTrackKey.physical)(sheet)
    + selectTrackWoundModifier(DamageTrackKey.stun)(sheet),
  )
}
