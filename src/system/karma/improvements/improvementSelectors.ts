import { createSelector } from "reselect"

import type { ImprovementEntry, SkillGroupIncreaseEntry, SkillIncreaseEntry } from "./improvementEntry.ts"
import { isSkillGroupIncreaseEntry, isSkillIncreaseEntry } from "./improvementEntry.ts"
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

export const selectQueuedActiveSkills: ImprovementsSelector<SkillIncreaseEntry[]> = createSelector([
  selectAllImprovements,
], (allEntries) => {
  return allEntries
    .filter(isSkillIncreaseEntry)
    .filter((entry) => entry.skillType === "ActiveSkill")
})

export const selectQueuedSkillGroups: ImprovementsSelector<SkillGroupIncreaseEntry[]> = createSelector([
  selectAllImprovements,
], (allEntries) => {
  return allEntries
    .filter(isSkillGroupIncreaseEntry)
})
