import { createSelector } from "reselect"

import type { LifestyleStoreState } from "#/components/character/profile/lifestyleStore.ts"
import { Lifestyles } from "#/system/lifestyleType.ts"

export const selectLifestyleQuality = (state: LifestyleStoreState) => state.quality
export const selectLifestyleMonthsPaid = (state: LifestyleStoreState) => state.monthsPaid
export const selectLifestyleInfo = createSelector(selectLifestyleQuality, (quality) => Lifestyles[quality])
