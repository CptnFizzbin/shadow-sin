import { useSelector } from "@tanstack/react-store"

import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import type { ImprovementsState } from "./improvementsState.ts"

export type ImprovementsSelector<TData> = (state: ImprovementsState) => TData

export function useImprovementsSelector<TData>(selector: ImprovementsSelector<TData>): TData {
  const { improvementsStore } = useSpendKarmaDialogContext()
  return useSelector(improvementsStore.store, selector)
}

export const selectQueuedActiveSkills: ImprovementsSelector<Set<SkillKey>> = (state) =>
  new Set(
    (Object.keys(state.activeSkillImprovement) as SkillKey[])
      .filter((k) => state.activeSkillImprovement[k] !== null && state.activeSkillImprovement[k] !== undefined),
  )

export const selectQueuedSkillGroups: ImprovementsSelector<Set<SkillGroupKey>> = (state) =>
  new Set(
    (Object.keys(state.skillGroupImprovement) as SkillGroupKey[])
      .filter((k) => state.skillGroupImprovement[k] !== null && state.skillGroupImprovement[k] !== undefined),
  )

export const selectHasImprovements: ImprovementsSelector<boolean> = (state) =>
  Object.values(state.attrImprovement).some(Boolean)
  || Object.values(state.activeSkillImprovement).some(Boolean)
  || Object.values(state.skillGroupImprovement).some(Boolean)
  || Object.values(state.knowledgeImprovement).some(Boolean)
  || Object.values(state.languageImprovement).some(Boolean)
  || Object.keys(state.learnSpell).length > 0
  || Object.keys(state.learnComplexForm).length > 0
