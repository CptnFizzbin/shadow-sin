import type { AnyImprovement } from "./types/anyImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"

export const NEW_SKILL_KARMA_COST = 2
export const NEW_SPELL_KARMA_COST = 5
export const SKILL_SPECIALIZATION_KARMA_COST = 2

export const calcAttributeKarmaCost = (newRating: number): number => 5 * newRating

export const calcActiveSkillKarmaCost = (newRating: number): number => 2 * newRating

export const calcSkillGroupKarmaCost = (newRating: number): number => 2 * newRating

export const calcImprovementKarmaCost = (improvement: AnyImprovement): number => {
  switch (improvement.type) {
    case ImprovementType.Attribute:
      return calcAttributeKarmaCost(improvement.newRating)
    case ImprovementType.ActiveSkill:
      if (improvement.newRating !== undefined) return calcActiveSkillKarmaCost(improvement.newRating)
      return SKILL_SPECIALIZATION_KARMA_COST
    case ImprovementType.SkillGroup:
      if (improvement.newRating !== undefined) return calcSkillGroupKarmaCost(improvement.newRating)
      return 0
    case ImprovementType.KnowledgeSkill:
    case ImprovementType.LanguageSkill:
      if (improvement.newRating !== undefined) return calcActiveSkillKarmaCost(improvement.newRating)
      return SKILL_SPECIALIZATION_KARMA_COST
    case ImprovementType.LearnSpell:
      return NEW_SPELL_KARMA_COST
    default:
      return 0
  }
}

export const calcImprovementsKarmaCost = (improvements: AnyImprovement[]): number =>
  improvements.reduce((total, improvement) => total + calcImprovementKarmaCost(improvement), 0)
