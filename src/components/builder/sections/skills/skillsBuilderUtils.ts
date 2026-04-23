import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"
import type { SkillGroupData } from "#/system/skills/skillGroupData"

const ActiveSkillBpPerRating = 4
const ActiveSkillGroupBpPerRating = 10
const ActiveSkillSpecializationBp = 2
const KnowledgeSkillSpPerRating = 1
const LanguageSkillSpPerRating = 1
const KnowledgeSpecializationSp = 1
const LanguageSpecializationSp = 1
export const ExtraSkillPointBpCost = 2
export const SkillRatingMax = 6
export const SkillGroupRatingMax = 4

export const getFreeSkillPoints = (
  logic: number,
  intuition: number,
): number => {
  return (logic + intuition) * 3
}

export const getActiveSkillBp = (
  skill: ActiveSkillData,
): number => {
  const baseSp = skill.rating * ActiveSkillBpPerRating

  const specializationSp =
    skill.specialization
      ? ActiveSkillSpecializationBp
      : 0

  return baseSp + specializationSp
}

export const getActiveSkillGroupBp = (group: SkillGroupData): number => {
  return group.rating * ActiveSkillGroupBpPerRating
}

export const getKnowledgeSkillSp = (
  skill: KnowledgeSkillData,
): number => {
  const baseSp = skill.rating * KnowledgeSkillSpPerRating

  const specializationSp =
    skill.specialization
      ? KnowledgeSpecializationSp
      : 0

  return baseSp + specializationSp
}

export const getLanguageSkillSp = (skill: LanguageSkillData): number => {
  const baseSp =
    skill.rating === "native"
      ? 0
      : skill.rating * LanguageSkillSpPerRating

  const specializationSp =
    skill.lingo
      ? LanguageSpecializationSp
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
  return extraSp * ExtraSkillPointBpCost
}
