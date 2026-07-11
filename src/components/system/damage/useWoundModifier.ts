import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

import { selectTrackWoundModifier } from "./damageUtils.ts"

export function useWoundModifier() {
  return useRunnerData((sheet) =>
    selectTrackWoundModifier(DamageTrackKey.physical)(sheet)
    + selectTrackWoundModifier(DamageTrackKey.stun)(sheet),
  )
}
