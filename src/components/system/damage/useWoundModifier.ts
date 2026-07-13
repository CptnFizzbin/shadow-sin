import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

import { selectTrackWoundModifier } from "./damageUtils.ts"

export function useWoundModifier() {
  return useRunnerStoreSelector((sheet) =>
    selectTrackWoundModifier(DamageTrackKey.physical)(sheet)
    + selectTrackWoundModifier(DamageTrackKey.stun)(sheet),
  )
}
