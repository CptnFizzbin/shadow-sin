import { createSelector } from "reselect"

import { selectAwakening } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

export function selectActiveSkills(state: RunnerData): ActiveSkillData[] {
  return state.skills.activeSkills
}

export function selectSkillGroups(state: RunnerData): SkillGroupData[] {
  return state.skills.skillGroups
}

export function selectKnowledgeSkills(state: RunnerData): KnowledgeSkillData[] {
  return state.skills.knowledgeSkills
}

export function selectLanguageSkills(state: RunnerData): LanguageSkillData[] {
  return state.skills.languageSkills
}

export function selectSkillValue(skillName: SkillKey) {
  return (state: RunnerData): number => {
    const skillInfo = skillList[skillName]
    const skillRating = state.skills.activeSkills.find((s) => s.name === skillName)?.rating ?? 0
    const groupRating = state.skills.skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
    return Math.max(skillRating, groupRating, 0)
  }
}

export function selectSkillSpecialization(skillName: SkillKey) {
  return (state: RunnerData): string | undefined => {
    return state.skills.activeSkills.find((s) => s.name === skillName)?.specialization
  }
}

export const selectAllowedActiveSkills: (state: RunnerData) => Partial<Record<SkillKey, SkillInfo>> = createSelector([
  selectAwakening,
], (awakeningType) => {
  const skillEntries = Object.entries(skillList)
    .filter(([_, info]) => {
      if (!info.awakening) return true
      return info.awakening.includes(awakeningType)
    })

  return Object.fromEntries(skillEntries)
})
