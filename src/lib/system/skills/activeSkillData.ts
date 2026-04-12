import type { SkillKey } from "#/lib/system/skills/skillKey"

export interface ActiveSkillData {
  name: SkillKey
  rating: number
  specialization?: string
}
