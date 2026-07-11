import { createSelector } from "reselect"

import { Lifestyles } from "#/system/lifestyleType.ts"

import type { LifestyleStoreState } from "./lifestyleStore.ts"

export const selectLifestyleQuality = (state: LifestyleStoreState) => state.quality
export const selectLifestyleMonthsPaid = (state: LifestyleStoreState) => state.monthsPaid
export const selectLifestyleInfo = createSelector(selectLifestyleQuality, (quality) => Lifestyles[quality])
