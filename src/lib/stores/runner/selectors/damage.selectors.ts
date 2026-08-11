import { createSelector } from "reselect"

import { selectTrackWoundModifier } from "#/components/system/damage/damageUtils.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

export const selectWoundMod = createSelector(
  [
    selectTrackWoundModifier(DamageTrackKey.physical),
    selectTrackWoundModifier(DamageTrackKey.stun),
  ],
  (physicalWoundMod, stunWoundMod) => physicalWoundMod + stunWoundMod,
)
