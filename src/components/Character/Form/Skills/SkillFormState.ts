import { SkillGroupKey } from "#/lib/system/types/SkillGroupKey.ts"

export interface ActiveSkillFormState {
  id: string
  name: string
  rating: number
  specialization?: string
}

export interface ActiveSkillGroupFormState {
  id: string
  groupName: SkillGroupKey
  rating: number
}

export interface KnowledgeSkillFormState {
  id: string
  name: string
  rating: number
  specialization?: string
}

export interface LanguageSkillFormState {
  id: string
  name: string
  isNative: boolean
  rating: number
  specialization?: string
}

export interface SkillsFormState {
  activeSkills: ActiveSkillFormState[]
  activeSkillGroups: ActiveSkillGroupFormState[]
  knowledgeSkills: KnowledgeSkillFormState[]
  languageSkills: LanguageSkillFormState[]
}
