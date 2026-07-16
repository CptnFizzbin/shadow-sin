import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"
import type { SkillGroupData } from "#/system/skills/skillGroupData"

/** @deprecated Use `BuilderConfig.skills.active.bpCost.perRating` instead. */
export const ActiveSkillBpPerRating = BuilderConfig.skills.active.bpCost.perRating
/** @deprecated Use `BuilderConfig.skills.group.bpCost.perRating` instead. */
export const ActiveSkillGroupBpPerRating = BuilderConfig.skills.group.bpCost.perRating
/** @deprecated Use `BuilderConfig.skills.active.bpCost.specialization` instead. */
export const ActiveSkillSpecializationBp = BuilderConfig.skills.active.bpCost.specialization
/** @deprecated Use `BuilderConfig.skills.knowledge.spCost.perRating` instead. */
export const KnowledgeSkillSpPerRating = BuilderConfig.skills.knowledge.spCost.perRating
/** @deprecated Use `BuilderConfig.skills.language.spCost.perRating` instead. */
export const LanguageSkillSpPerRating = BuilderConfig.skills.language.spCost.perRating
/** @deprecated Use `BuilderConfig.skills.knowledge.spCost.specialization` instead. */
export const KnowledgeSpecializationSp = BuilderConfig.skills.knowledge.spCost.specialization
/** @deprecated Use `BuilderConfig.skills.language.spCost.specialization` instead. */
export const LanguageSpecializationSp = BuilderConfig.skills.language.spCost.specialization
/** @deprecated Use `BuilderConfig.skills.knowledge.bpCost.extraSkillPoint` instead. */
export const ExtraSkillPointBpCost = BuilderConfig.skills.knowledge.bpCost.extraSkillPoint

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
    skill.rating === "native"
      ? 0
      : skill.rating * BuilderConfig.skills.language.spCost.perRating

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

export const calculateKnowledgeAndLanguageSpUsed = (
  knowledgeSkills: KnowledgeSkillData[],
  languageSkills: LanguageSkillData[],
): number => {
  const knowledgeSp = knowledgeSkills.reduce((total, skill) => {
    return total + getKnowledgeSkillSp(skill)
  }, 0)
  const languageSp = languageSkills.reduce((total, skill) => {
    return (
      total
      + getLanguageSkillSp(skill)
    )
  }, 0)
  return knowledgeSp + languageSp
}

export const calculateExtraSpBp = (
  totalSpUsed: number,
  freeSkillPoints: number,
): number => {
  const extraSp = Math.max(0, totalSpUsed - freeSkillPoints)
  return extraSp * BuilderConfig.skills.knowledge.bpCost.extraSkillPoint
}
