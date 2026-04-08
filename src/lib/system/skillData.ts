import type { SkillGroupKey } from "#/lib/system/skillGroupKey.ts"
import type { SkillKey } from "#/lib/system/skillKey.ts"
import type { SpecializationKey } from "#/lib/system/specializationKey.ts"

export interface ActiveSkillData {
  name: SkillKey
  rating: number
  specialization?: SpecializationKey
}

export interface SkillGroupData {
  name: SkillGroupKey
  rating: number
}

export interface KnowledgeSkillData {
  name: string
  rating: number
  specialization?: string
}

export interface LanguageSkillData {
  name: string
  rating: number | "native"
  lingo?: string
}
