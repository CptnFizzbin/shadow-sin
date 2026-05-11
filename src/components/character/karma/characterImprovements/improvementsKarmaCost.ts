import type { ImprovementsState } from "./improvementsState.ts"

export const NEW_SKILL_KARMA_COST = 2
export const NEW_SPELL_KARMA_COST = 5
export const NEW_COMPLEX_FORM_KARMA_COST = 4
export const SKILL_SPECIALIZATION_KARMA_COST = 2

export const calcAttributeKarmaCost = (newRating: number): number => 5 * newRating

export const calcActiveSkillKarmaCost = (newRating: number): number => 2 * newRating

export const calcSkillGroupKarmaCost = (newRating: number): number => 2 * newRating

export const calcImprovementsKarmaCost = (state: ImprovementsState): number => {
  let total = 0

  for (const value of Object.values(state.attrImprovement)) {
    if (value) total += calcAttributeKarmaCost(value.newRating)
  }

  for (const value of Object.values(state.activeSkillImprovement)) {
    if (!value) continue
    total += value.newRating !== undefined
      ? calcActiveSkillKarmaCost(value.newRating)
      : SKILL_SPECIALIZATION_KARMA_COST
  }

  for (const value of Object.values(state.skillGroupImprovement)) {
    if (value?.newRating !== undefined) total += calcSkillGroupKarmaCost(value.newRating)
  }

  for (const value of Object.values(state.knowledgeImprovement)) {
    if (!value) continue
    total += value.newRating !== undefined
      ? calcActiveSkillKarmaCost(value.newRating)
      : SKILL_SPECIALIZATION_KARMA_COST
  }

  for (const value of Object.values(state.languageImprovement)) {
    if (!value) continue
    total += value.newRating !== undefined
      ? calcActiveSkillKarmaCost(value.newRating)
      : SKILL_SPECIALIZATION_KARMA_COST
  }

  total += Object.keys(state.learnSpell).length * NEW_SPELL_KARMA_COST
  total += Object.keys(state.learnComplexForm).length * NEW_COMPLEX_FORM_KARMA_COST

  return total
}
