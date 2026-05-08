import type { ImprovementType } from "./improvementType.ts"

export interface KnowledgeSkillImprovement {
  type: ImprovementType.KnowledgeSkill
  skill: string
  newRating?: number
  specialization?: string
}
