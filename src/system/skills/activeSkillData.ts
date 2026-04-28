import type { SkillKey } from "./skillKey"

export interface ActiveSkillData {
  name: SkillKey
  rating: number
  specialization?: string
}
