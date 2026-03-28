import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/CharacterBuilder/Sections/Skills/SkillFormState.ts"

export const ActiveSkillBpPerRating = 4
export const ActiveSkillGroupBpPerRating = 10
export const ActiveSkillSpecializationBp = 2
export const KnowledgeSkillSpPerRating = 1
export const LanguageSkillSpPerRating = 1
export const KnowledgeSpecializationSp = 1
export const LanguageSpecializationSp = 1
export const ExtraSkillPointBpCost = 2
export const SkillRatingMax = 6
export const SkillGroupRatingMax = 4

export const getFreeSkillPoints = (
  logic: number,
  intuition: number,
): number => {
  return (logic + intuition) * 3
}

export const getMaxSkillPoints = (logic: number, intuition: number): number => {
  return (logic + intuition) * 6
}

export const getActiveSkillBp = (
  rating: number,
  hasSpecialization: boolean,
): number => {
  return (
    rating * ActiveSkillBpPerRating
    + (hasSpecialization ? ActiveSkillSpecializationBp : 0)
  )
}

export const getActiveSkillGroupBp = (rating: number): number => {
  return rating * ActiveSkillGroupBpPerRating
}

export const getKnowledgeSkillSp = (
  rating: number,
  hasSpecialization: boolean,
): number => {
  return (
    rating * KnowledgeSkillSpPerRating
    + (hasSpecialization ? KnowledgeSpecializationSp : 0)
  )
}

export const getLanguageSkillSp = (
  isNative: boolean,
  rating: number,
  hasSpecialization: boolean,
): number => {
  if (isNative) return hasSpecialization ? LanguageSpecializationSp : 0
  return (
    rating * LanguageSkillSpPerRating
    + (hasSpecialization ? LanguageSpecializationSp : 0)
  )
}

export const calculateActiveSkillsBp = (
  activeSkills: ActiveSkillFormState[],
  activeSkillGroups: ActiveSkillGroupFormState[],
): number => {
  const skillsBp = activeSkills.reduce((total, skill) => {
    return total + getActiveSkillBp(skill.rating, !!skill.specialization)
  }, 0)
  const groupsBp = activeSkillGroups.reduce((total, group) => {
    return total + getActiveSkillGroupBp(group.rating)
  }, 0)
  return skillsBp + groupsBp
}

export const calculateKnowledgeAndLanguageSpUsed = (
  knowledgeSkills: KnowledgeSkillFormState[],
  languageSkills: LanguageSkillFormState[],
): number => {
  const knowledgeSp = knowledgeSkills.reduce((total, skill) => {
    return total + getKnowledgeSkillSp(skill.rating, !!skill.specialization)
  }, 0)
  const languageSp = languageSkills.reduce((total, skill) => {
    return (
      total
      + getLanguageSkillSp(skill.isNative, skill.rating, !!skill.specialization)
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
