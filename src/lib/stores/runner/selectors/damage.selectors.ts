import { createSelector } from "reselect"

import { selectTrackWoundModifier } from "#/components/system/damage/damageUtils.ts"
import { selectMatrixTrack, selectPhysicalTrack, selectStunTrack } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface DamageTrackFacets {
  current: number
  max: number
}

const damageTrackSelectors = {
  [DamageTrackKey.physical]: selectPhysicalTrack,
  [DamageTrackKey.stun]: selectStunTrack,
  [DamageTrackKey.matrix]: selectMatrixTrack,
}

export const selectDamageTrackFacets = createSelector(
  [
    (state: RunnerData, track: DamageTrackKey) => damageTrackSelectors[track](state),
  ],
  ({ current, max }): DamageTrackFacets => ({ current, max }),
)

export const selectWoundMod = createSelector(
  [
    selectTrackWoundModifier(DamageTrackKey.physical),
    selectTrackWoundModifier(DamageTrackKey.stun),
  ],
  (physicalWoundMod, stunWoundMod) => physicalWoundMod + stunWoundMod,
)
