import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"

import type { ImprovementType } from "./improvementType.ts"

export interface SkillGroupImprovement {
  type: ImprovementType.SkillGroup
  group: SkillGroupKey
  newRating?: number
}
