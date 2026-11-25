import type { ActiveSkillData } from "#data/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#data/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#data/skills/languageSkillData.ts"
import type { SkillGroupData } from "#data/skills/skillGroupData.ts"

import { BuilderConfig } from "./builderConfig.ts"

export const getFreeSkillPoints = (
  logic: number,
  intuition: number,
): number => {
  return (logic + intuition) * BuilderConfig.skills.knowledge.freeSkillPointsPerAttribute
}

export const getActiveSkillBp = (
  skill: ActiveSkillData,
): number => {
  const baseSp = skill.rating * BuilderConfig.skills.active.bpCost.perRating

  const specializationSp =
    skill.specialization
      ? BuilderConfig.skills.active.bpCost.specialization
      : 0

  return baseSp + specializationSp
}

export const getActiveSkillGroupBp = (group: SkillGroupData): number => {
  return group.rating * BuilderConfig.skills.group.bpCost.perRating
}

export const getKnowledgeSkillSp = (
  skill: KnowledgeSkillData,
): number => {
  const baseSp = skill.rating * BuilderConfig.skills.knowledge.spCost.perRating

  const specializationSp =
    skill.specialization
      ? BuilderConfig.skills.knowledge.spCost.specialization
      : 0

  return baseSp + specializationSp
}

export const getLanguageSkillSp = (skill: LanguageSkillData): number => {
  const baseSp =
    skill.isNative
      ? 0
      : (skill.rating ?? 0) * BuilderConfig.skills.language.spCost.perRating

  const specializationSp =
    skill.lingo
      ? BuilderConfig.skills.language.spCost.specialization
      : 0

  return baseSp + specializationSp
}

export const calculateActiveSkillsBp = (
  activeSkills: ActiveSkillData[],
  activeSkillGroups: SkillGroupData[],
): number => {
  const skillsBp = activeSkills.reduce((total, skill) => {
    return total + getActiveSkillBp(skill)
  }, 0)

  const groupsBp = activeSkillGroups.reduce((total, group) => {
    return total + getActiveSkillGroupBp(group)
  }, 0)

  return skillsBp + groupsBp
}
