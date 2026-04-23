import { createSelector } from "reselect"

import type { DamageStoreState } from "#/components/damage/damageStore.ts"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"

export const selectPhysicalTrack = (state: DamageStoreState) => state.physical
export const selectStunTrack = (state: DamageStoreState) => state.stun
export const selectPhysicalMax = createSelector(selectPhysicalTrack, (physical) => physical.max)
export const selectPhysicalCurrent = createSelector(selectPhysicalTrack, (physical) => physical.current)
export const selectPhysicalWoundInterval = createSelector(selectPhysicalTrack, (physical) => physical.woundInterval)
export const selectStunMax = createSelector(selectStunTrack, (stun) => stun.max)
export const selectStunCurrent = createSelector(selectStunTrack, (stun) => stun.current)
export const selectStunWoundInterval = createSelector(selectStunTrack, (stun) => stun.woundInterval)
export const selectTrackCurrent = (trackKey: DamageTrackKey) => (state: DamageStoreState) => state[trackKey].current
export const selectTrackMax = (trackKey: DamageTrackKey) => (state: DamageStoreState) => state[trackKey].max
