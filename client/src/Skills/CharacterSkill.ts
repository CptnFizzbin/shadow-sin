import { ActiveSkillId } from './ActiveSkills'

export type SkillList = Record<string, CharacterActiveSkill>

export enum SkillType {
  active = 'active',
  language = 'language',
  knowledge = 'knowledge',
}

export interface BasicCharacterSkill {
  type: SkillType
}

export interface CharacterActiveSkill extends BasicCharacterSkill {
  type: SkillType.active
  id: ActiveSkillId
  rank: number
  specialization?: string
  expertise?: string
}

export interface CharacterLanguageSkill extends BasicCharacterSkill {
  type: SkillType.language
  name: string
  rank: 'basic' | 'speciality' | 'expertise' | 'native'
}

export interface CharacterKnowledgeSkill extends BasicCharacterSkill {
  type: SkillType.knowledge
  name: string
}

export type CharacterSkill =
  | CharacterActiveSkill
  | CharacterLanguageSkill
  | CharacterKnowledgeSkill

export const hasSpecialty = (skill?: CharacterActiveSkill, specialization?: string): boolean => {
  if (!specialization || !skill || !skill.specialization) return false
  return skill.specialization.toLowerCase() === specialization.toLowerCase()
}
export const hasExpertise = (skill?: CharacterActiveSkill, expertise?: string): boolean => {
  if (!expertise || !skill || !skill.expertise) return false
  return skill.expertise.toLowerCase() === expertise.toLowerCase()
}

export function isActiveSkill (skill: BasicCharacterSkill): skill is CharacterActiveSkill {
  return skill.type === SkillType.active
}

export function isLanguageSkill (skill: BasicCharacterSkill): skill is CharacterLanguageSkill {
  return skill.type === SkillType.language
}

export function isKnowledgeSkill (skill: BasicCharacterSkill): skill is CharacterKnowledgeSkill {
  return skill.type === SkillType.knowledge
}
