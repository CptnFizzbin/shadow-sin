import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import type { ImprovementsState } from "./improvementsState.ts"

export const describeAttributeImprovement = (attr: AttributeKey, newRating: number): string => {
  const previousRating = newRating - 1
  return `${AttributeLabels[attr]} ${previousRating} → ${newRating}`
}

export const describeActiveSkillImprovement = (
  skill: SkillKey,
  value: { newRating?: number, newSpecialization?: string },
): string => {
  if (value.newRating !== undefined) {
    const previousRating = value.newRating - 1
    return previousRating === 0
      ? `${skill} (new)`
      : `${skill} ${previousRating} → ${value.newRating}`
  }
  return `${skill}: ${value.newSpecialization} (specialization)`
}

export const describeSkillGroupImprovement = (group: SkillGroupKey, newRating: number | undefined): string => {
  if (newRating !== undefined) {
    const previousRating = newRating - 1
    return `${group} ${previousRating} → ${newRating}`
  }
  return String(group)
}

export const describeKnowledgeSkillImprovement = (
  skill: string,
  value: { newRating?: number, newSpecialization?: string },
): string => {
  if (value.newRating !== undefined) {
    const previousRating = value.newRating - 1
    return previousRating === 0
      ? `${skill} (new)`
      : `${skill} ${previousRating} → ${value.newRating}`
  }
  return `${skill}: ${value.newSpecialization} (specialization)`
}

export const describeLanguageSkillImprovement = (
  skill: string,
  value: { newRating?: number, newSpecialization?: string },
): string => {
  if (value.newRating !== undefined) {
    const previousRating = value.newRating - 1
    return previousRating === 0
      ? `${skill} (new)`
      : `${skill} ${previousRating} → ${value.newRating}`
  }
  return `${skill}: ${value.newSpecialization} (specialization)`
}

export const describeImprovementState = (state: ImprovementsState): string[] => {
  const labels: string[] = []

  for (const [attr, value] of Object.entries(state.attrImprovement)) {
    if (value) labels.push(describeAttributeImprovement(attr as AttributeKey, value.newRating))
  }

  for (const [skill, value] of Object.entries(state.activeSkillImprovement)) {
    if (value) labels.push(describeActiveSkillImprovement(skill as SkillKey, value))
  }

  for (const [group, value] of Object.entries(state.skillGroupImprovement)) {
    if (value) labels.push(describeSkillGroupImprovement(group as SkillGroupKey, value.newRating))
  }

  for (const [skill, value] of Object.entries(state.knowledgeImprovement)) {
    if (value) labels.push(describeKnowledgeSkillImprovement(skill, value))
  }

  for (const [skill, value] of Object.entries(state.languageImprovement)) {
    if (value) labels.push(describeLanguageSkillImprovement(skill, value))
  }

  for (const spell of Object.values(state.learnSpell)) {
    labels.push(`${spell.name} (new spell)`)
  }

  return labels
}
