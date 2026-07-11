import { createSelector } from "reselect"

import { Lifestyles } from "#/system/lifestyleType.ts"

import type { LifestyleStoreState } from "./lifestyleStore.ts"

/** @deprecated Use `selectLifestyleQuality` from `#/stores/runner/profile/profileSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `LifestyleStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectLifestyleQuality = (state: LifestyleStoreState) => state.quality

/** @deprecated Use `selectLifestyleMonthsPaid` from `#/stores/runner/profile/profileSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `LifestyleStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectLifestyleMonthsPaid = (state: LifestyleStoreState) => state.monthsPaid

/** @deprecated Use `selectLifestyleInfo` from `#/stores/runner/profile/profileSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `LifestyleStoreState`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectLifestyleInfo = createSelector(selectLifestyleQuality, (quality) => Lifestyles[quality])
