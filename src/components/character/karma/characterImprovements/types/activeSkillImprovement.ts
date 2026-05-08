import type { SkillKey } from "#/system/skills/skillKey.ts"

import type { ImprovementType } from "./improvementType.ts"

export interface ActiveSkillImprovement {
  type: ImprovementType.ActiveSkill
  skill: SkillKey
  newRating?: number
  specialization?: string
}
