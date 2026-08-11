import type { Selector } from "reselect"

import type { DamageTrackInfo } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { selectPhysicalTrack, selectStunTrack } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { selectWoundMod } from "./damage.selectors.ts"

// Matrix-relative damage isn't RunnerData-only (it needs the active MatrixNode) — it lives in
// matrix.catalog.ts behind useMatrixSelector instead. See docs/adr/0013-unify-runner-state-access.md.
type NonMatrixDamageTrackKey = Exclude<DamageTrackKey, DamageTrackKey.matrix>

const trackSelectors: Record<NonMatrixDamageTrackKey, Selector<RunnerData, DamageTrackInfo>> = {
  [DamageTrackKey.physical]: selectPhysicalTrack,
  [DamageTrackKey.stun]: selectStunTrack,
}

const selectAllTracks: Selector<RunnerData, Record<NonMatrixDamageTrackKey, DamageTrackInfo>> = (state) => ({
  [DamageTrackKey.physical]: selectPhysicalTrack(state),
  [DamageTrackKey.stun]: selectStunTrack(state),
})

export const damageCatalog = {
  woundMod: selectWoundMod,
  all: selectAllTracks,
  forTrack: (track: NonMatrixDamageTrackKey): Selector<RunnerData, DamageTrackInfo> => trackSelectors[track],
}
