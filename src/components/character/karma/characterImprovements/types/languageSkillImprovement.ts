import type { ImprovementType } from "./improvementType.ts"

export interface LanguageSkillImprovement {
  type: ImprovementType.LanguageSkill
  skill: string
  newRating?: number
  specialization?: string
}
