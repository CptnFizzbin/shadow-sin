import { CharacterAttr } from '../../../Character/CharacterAttr'
import { BasicSkillData, SkillType } from '../SkillData'
import { ActiveSkill } from './ActiveSkillId'

export type SkillList = Record<string, number>

export interface ActiveSkillData extends BasicSkillData {
  type: SkillType.active
  name: ActiveSkill
  rank: number
  attr: CharacterAttr | ''
  altAttr?: CharacterAttr | ''
  speciality?: string | null
  expertise?: string | null
}

export function isActiveSkill (skill: BasicSkillData): skill is ActiveSkillData {
  return skill.type === SkillType.active
}

export const hasSpecialty = (skill?: ActiveSkillData, specialty?: string): boolean => {
  if (!specialty || !skill || !skill.speciality) return false
  return skill.speciality.toLowerCase() === specialty.toLowerCase()
}

export const hasExpertise = (skill?: ActiveSkillData, specialty?: string): boolean => {
  if (!specialty || !skill || !skill.expertise) return false
  return skill.expertise.toLowerCase() === specialty.toLowerCase()
}
