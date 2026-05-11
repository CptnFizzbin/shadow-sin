import { useSelector } from "@tanstack/react-store"
import { createSelector } from "reselect"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import type { ImprovementsState } from "./improvementsState.ts"
import type { ActiveSkillImprovement } from "./types/activeSkillImprovement.ts"
import type { AnyImprovement } from "./types/anyImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"

export type ImprovementsSelector<TData> = (state: ImprovementsState) => TData

export function useImprovementsSelector<TData>(selector: ImprovementsSelector<TData>): TData {
  const { improvementsStore } = useSpendKarmaDialogContext()
  return useSelector(improvementsStore.store, selector)
}

export const selectQueuedImprovements: ImprovementsSelector<AnyImprovement[]> = (state) => {
  const improvements: AnyImprovement[] = []

  for (const [attr, value] of Object.entries(state.attrImprovement)) {
    if (value) {
      improvements.push({
        type: ImprovementType.Attribute,
        attribute: attr as AttributeKey,
        newRating: value.newRating,
      })
    }
  }

  for (const [skill, value] of Object.entries(state.activeSkillImprovement)) {
    if (value) {
      improvements.push({
        type: ImprovementType.ActiveSkill,
        skill: skill as SkillKey,
        newRating: value.newRating,
        specialization: value.newSpecialization,
      })
    }
  }

  for (const [group, value] of Object.entries(state.skillGroupImprovement)) {
    if (value) {
      improvements.push({ type: ImprovementType.SkillGroup, group: group as SkillGroupKey, newRating: value.newRating })
    }
  }

  for (const [skill, value] of Object.entries(state.knowledgeImprovement)) {
    if (value) {
      improvements.push({
        type: ImprovementType.KnowledgeSkill,
        skill,
        newRating: value.newRating,
        specialization: value.newSpecialization,
      })
    }
  }

  for (const [skill, value] of Object.entries(state.languageImprovement)) {
    if (value) {
      improvements.push({
        type: ImprovementType.LanguageSkill,
        skill,
        newRating: value.newRating,
        specialization: value.newSpecialization,
      })
    }
  }

  for (const spell of Object.values(state.learnSpell)) {
    improvements.push({ type: ImprovementType.LearnSpell, spell })
  }

  return improvements
}

export const selectQueuedActiveSkills = createSelector([
  selectQueuedImprovements,
], (improvements) => new Set(
  improvements
    .filter((i): i is ActiveSkillImprovement => i.type === ImprovementType.ActiveSkill)
    .map((i) => i.skill),
))

export const selectQueuedSkillGroups = createSelector([
  selectQueuedImprovements,
], (improvements) => new Set(
  improvements
    .filter((i): i is ActiveSkillImprovement => i.type === ImprovementType.ActiveSkill)
    .map((i) => i.skill),
))
