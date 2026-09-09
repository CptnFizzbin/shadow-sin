import { createSelector } from "reselect"

import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ObjectUtils } from "#/lib/objectUtils.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"

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

// eslint-disable-next-line @typescript-eslint/no-namespace -- TODO: rename file to improvements.selectors.ts
export namespace ImprovementsSelectors {
  export const selectImprovableAttrs = createMemoizedSelector(
    AttrSelectors.selectAllInfo,
    (attrs) => {
      return ObjectUtils.filterEntries(attrs, (_key, value) => {
        return !value.computed && value.max >= 1
      })
    },
  )
}
