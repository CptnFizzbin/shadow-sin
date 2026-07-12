import { createSelector } from "reselect"

import type { DamageStoreState } from "./damageStore.ts"

/** @deprecated Use `selectPhysicalTrack` from `#/stores/runner/damage/damageSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `DamageStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectPhysicalTrack = (state: DamageStoreState) => state.physical

/** @deprecated Use `selectStunTrack` from `#/stores/runner/damage/damageSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `DamageStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectStunTrack = (state: DamageStoreState) => state.stun

/** @deprecated Derive from `selectPhysicalTrack` (`#/stores/runner/damage/damageSlice.selectors.ts`) instead. */
export const selectPhysicalMax = createSelector(selectPhysicalTrack, (physical) => physical.max)

/** @deprecated Derive from `selectPhysicalTrack` (`#/stores/runner/damage/damageSlice.selectors.ts`) instead. */
export const selectPhysicalCurrent = createSelector(selectPhysicalTrack, (physical) => physical.current)

/** @deprecated Derive from `selectStunTrack` (`#/stores/runner/damage/damageSlice.selectors.ts`) instead. */
export const selectStunMax = createSelector(selectStunTrack, (stun) => stun.max)

/** @deprecated Derive from `selectStunTrack` (`#/stores/runner/damage/damageSlice.selectors.ts`) instead. */
export const selectStunCurrent = createSelector(selectStunTrack, (stun) => stun.current)
