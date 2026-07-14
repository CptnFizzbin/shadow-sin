import { createSelector } from "reselect"

import type { ImprovementEntry } from "./improvementEntry.ts"
import type { ImprovementsState } from "./improvementStore.ts"
import { getImprovementCost } from "./improvementUtils.ts"

export type ImprovementsSelector<TData> = (state: ImprovementsState) => TData

export const selectAllImprovements: ImprovementsSelector<ImprovementEntry[]> = createSelector([
  (state) => state,
], (state) => {
  return Object.values(state)
})

export const selectHasImprovements: ImprovementsSelector<boolean> = createSelector([
  selectAllImprovements,
], (allEntries) => allEntries.length > 0)

export const selectImprovementsTotalCost: ImprovementsSelector<number> = createSelector([
  selectAllImprovements,
], (allEntries) => {
  return allEntries
    .map((entry) => getImprovementCost(entry))
    .reduce((sum, cost) => sum + cost, 0)
})
