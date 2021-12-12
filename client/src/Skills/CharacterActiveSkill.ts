import { ActiveSkillName } from './ActiveSkillName'
import { BasicSkillData, SkillType } from './SkillData'

export interface CharacterActiveSkill extends BasicSkillData {
  type: SkillType.active
  name: ActiveSkillName
  rank: number
  specialization?: string
  expertise?: string
}

export const hasSpecialty = (skill?: CharacterActiveSkill, specialization?: string): boolean => {
  if (!specialization || !skill || !skill.specialization) return false
  return skill.specialization.toLowerCase() === specialization.toLowerCase()
}

export const hasExpertise = (skill?: CharacterActiveSkill, expertise?: string): boolean => {
  if (!expertise || !skill || !skill.expertise) return false
  return skill.expertise.toLowerCase() === expertise.toLowerCase()
}
