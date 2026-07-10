import { AttributeLabels } from "#/system/attributeKey.ts"

import type { ImprovementEntry } from "./improvementEntry.ts"
import { ImprovementType } from "./improvementType.ts"

/**
 * Render a short human-friendly description of an improvement, suitable for
 * the karma ledger and other audit surfaces.
 */
export const describeImprovement = (entry: ImprovementEntry): string => {
  switch (entry.type) {
    case ImprovementType.attrIncrease:
      return `Raised ${AttributeLabels[entry.attr]} ${entry.baseRating} → ${entry.newRating}`
    case ImprovementType.skillIncrease:
      return `Raised ${entry.skill} ${entry.baseRating} → ${entry.newRating}`
    case ImprovementType.skillGroupIncrease:
      return `Raised ${entry.group} (Group) ${entry.baseRating} → ${entry.newRating}`
    case ImprovementType.skillSpecialization:
      return `Added specialization "${entry.specialization}" to ${entry.skill}`
    case ImprovementType.learnActiveSkill:
      return `Learned skill ${entry.skill.name} at rating ${entry.skill.rating}`
    case ImprovementType.learnSkillGroup:
      return `Learned skill group ${entry.group.name} at rating ${entry.group.rating}`
    case ImprovementType.learnKnowledgeSkill:
      return `Learned knowledge ${entry.skill.name} at rating ${entry.skill.rating}`
    case ImprovementType.learnLanguageSkill:
      return `Learned language ${entry.skill.name} at rating ${entry.skill.rating}`
    case ImprovementType.learnSpell:
      return `Learned spell ${entry.spell.name}`
    case ImprovementType.learnComplexForm:
      return `Learned complex form ${entry.complexForm.name}`
    case ImprovementType.complexFormIncrease:
      return `Raised complex form ${entry.complexFormId} ${entry.baseRating} → ${entry.newRating}`
  }
}
