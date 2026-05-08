import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

export interface IncreaseSkillEntry {
  key: SkillKey
  currentRating: number
  groupToBreak?: SkillGroupKey
}
