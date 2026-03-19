import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
  KnowledgeSkillFormState,
  LanguageSkillFormState,
  SkillsFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"

export const ActiveSkillBpPerRating = 4
export const ActiveSkillGroupBpPerRating = 10
export const ActiveSkillSpecializationBp = 2
export const KnowledgeSkillSpPerRating = 1
export const LanguageSkillSpPerRating = 1
export const KnowledgeSpecializationSp = 1
export const LanguageSpecializationSp = 1
export const ExtraSkillPointBpCost = 2
export const SkillRatingMax = 6

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
    rating * ActiveSkillBpPerRating +
    (hasSpecialization ? ActiveSkillSpecializationBp : 0)
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
    rating * KnowledgeSkillSpPerRating +
    (hasSpecialization ? KnowledgeSpecializationSp : 0)
  )
}

export const getLanguageSkillSp = (
  isNative: boolean,
  rating: number,
  hasSpecialization: boolean,
): number => {
  if (isNative) return hasSpecialization ? LanguageSpecializationSp : 0
  return (
    rating * LanguageSkillSpPerRating +
    (hasSpecialization ? LanguageSpecializationSp : 0)
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
      total +
      getLanguageSkillSp(skill.isNative, skill.rating, !!skill.specialization)
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

export const calculateTotalSkillsBp = (
  skills: SkillsFormState,
  logic: number,
  intuition: number,
): number => {
  const activeSkillsBp = calculateActiveSkillsBp(
    skills.activeSkills,
    skills.activeSkillGroups,
  )
  const totalSpUsed = calculateKnowledgeAndLanguageSpUsed(
    skills.knowledgeSkills,
    skills.languageSkills,
  )
  const freeSkillPoints = getFreeSkillPoints(logic, intuition)
  const extraSpBp = calculateExtraSpBp(totalSpUsed, freeSkillPoints)
  return activeSkillsBp + extraSpBp
}

/**
 * Validate active skill rating constraints:
 * - At most 1 skill at R6 with all others at R4
 * - OR at most 2 skills at R5 with all others at R4
 */
export const getActiveSkillRatingWarnings = (
  activeSkills: ActiveSkillFormState[],
): string[] => {
  const warnings: string[] = []
  const r6Count = activeSkills.filter((s) => s.rating >= 6).length
  const r5Count = activeSkills.filter((s) => s.rating === 5).length
  const aboveR4Count = activeSkills.filter((s) => s.rating > 4).length

  if (r6Count > 1) {
    warnings.push("Active skills: cannot have more than 1 skill at Rating 6")
  }
  if (r6Count === 1 && r5Count > 0) {
    warnings.push(
      "Active skills: cannot have a Rating 6 skill alongside any Rating 5 skills",
    )
  }
  if (r6Count === 0 && aboveR4Count > 2) {
    warnings.push("Active skills: cannot have more than 2 skills at Rating 5")
  }

  return warnings
}

/**
 * Validate knowledge & language skill rating constraints (same rules as active skills).
 */
export const getKnowledgeSkillRatingWarnings = (
  knowledgeSkills: KnowledgeSkillFormState[],
  languageSkills: LanguageSkillFormState[],
): string[] => {
  const warnings: string[] = []
  const allSkills = [
    ...knowledgeSkills.map((s) => s.rating),
    ...languageSkills.filter((s) => !s.isNative).map((s) => s.rating),
  ]

  const r6Count = allSkills.filter((r) => r >= 6).length
  const r5Count = allSkills.filter((r) => r === 5).length
  const aboveR4Count = allSkills.filter((r) => r > 4).length

  if (r6Count > 1) {
    warnings.push(
      "Knowledge & Language skills: cannot have more than 1 skill at Rating 6",
    )
  }
  if (r6Count === 1 && r5Count > 0) {
    warnings.push(
      "Knowledge & Language skills: cannot have a Rating 6 skill alongside any Rating 5 skills",
    )
  }
  if (r6Count === 0 && aboveR4Count > 2) {
    warnings.push(
      "Knowledge & Language skills: cannot have more than 2 skills at Rating 5",
    )
  }

  return warnings
}
