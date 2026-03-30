import type { SkillGroupKey } from "#/lib/system/SkillGroupKey.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"

export interface ActiveSkillData {
  name: SkillKey
  rating: number
  specialization?: string
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
