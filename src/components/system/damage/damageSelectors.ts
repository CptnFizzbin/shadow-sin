import { createSelector } from "reselect"

import type { DamageStoreState } from "./damageStore.ts"

export const selectPhysicalTrack = (state: DamageStoreState) => state.physical
export const selectStunTrack = (state: DamageStoreState) => state.stun
export const selectPhysicalMax = createSelector(selectPhysicalTrack, (physical) => physical.max)
export const selectPhysicalCurrent = createSelector(selectPhysicalTrack, (physical) => physical.current)
export const selectStunMax = createSelector(selectStunTrack, (stun) => stun.max)
export const selectStunCurrent = createSelector(selectStunTrack, (stun) => stun.current)
