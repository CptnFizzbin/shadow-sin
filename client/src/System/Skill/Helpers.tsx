import { ActiveSkillData } from './SkillData'

export const hasSpecialty = (skill?: ActiveSkillData, specialty?: string): boolean => {
  if (!specialty || !skill || !skill.speciality) return false
  return skill.speciality.toLowerCase() === specialty.toLowerCase()
}

export const hasExpertise = (skill?: ActiveSkillData, specialty?: string): boolean => {
  if (!specialty || !skill || !skill.expertise) return false
  return skill.expertise.toLowerCase() === specialty.toLowerCase()
}
