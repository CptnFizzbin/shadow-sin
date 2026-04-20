import type { SkillKey } from "#/system/skills/skillKey"

export interface ActiveSkillData {
  name: SkillKey
  rating: number
  specialization?: string
}
