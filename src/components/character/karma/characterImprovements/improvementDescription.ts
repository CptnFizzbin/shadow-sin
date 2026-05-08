import { AttributeLabels } from "#/system/attributeKey.ts"

import type { AnyImprovement } from "./types/anyImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"

export const describeImprovement = (improvement: AnyImprovement): string => {
  switch (improvement.type) {
    case ImprovementType.Attribute: {
      const previousRating = improvement.newRating - 1
      return `${AttributeLabels[improvement.attribute]} ${previousRating} → ${improvement.newRating}`
    }
    case ImprovementType.ActiveSkill: {
      if (improvement.newRating !== undefined) {
        const previousRating = improvement.newRating - 1
        return previousRating === 0
          ? `${improvement.skill} (new)`
          : `${improvement.skill} ${previousRating} → ${improvement.newRating}`
      }
      return `${improvement.skill}: ${improvement.specialization} (specialization)`
    }
    case ImprovementType.SkillGroup: {
      if (improvement.newRating !== undefined) {
        const previousRating = improvement.newRating - 1
        return `${improvement.group} ${previousRating} → ${improvement.newRating}`
      }
      return improvement.group
    }
    case ImprovementType.KnowledgeSkill:
    case ImprovementType.LanguageSkill: {
      if (improvement.newRating !== undefined) {
        const previousRating = improvement.newRating - 1
        return previousRating === 0
          ? `${improvement.skill} (new)`
          : `${improvement.skill} ${previousRating} → ${improvement.newRating}`
      }
      return `${improvement.skill}: ${improvement.specialization} (specialization)`
    }
    case ImprovementType.LearnSpell:
      return `${improvement.spell.name} (new spell)`
    default:
      return "Unknown improvement"
  }
}
