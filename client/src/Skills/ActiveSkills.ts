import { CharacterAttr } from '../Character/CharacterAttr'
import { ActiveSkillId as CrbSkillId, ActiveSkills as CrbSkills } from '../data/Rulebooks/CRB'

export interface ActiveSkill {
  id: ActiveSkillId
  name: string
  untrained: boolean
  attr: CharacterAttr
  altAttr?: CharacterAttr
  specializations: string[]
  multiSpecialization?: boolean
}

export type ActiveSkillId = string;

export const ActiveSkillIds = {
  CRB: CrbSkillId,
}

export const ActiveSkills: Record<ActiveSkillId, ActiveSkill> = {}
const registerSkill = (skill: ActiveSkill) => ActiveSkills[skill.id] = skill

CrbSkills.forEach(registerSkill)

export function formatSkill (skillId: ActiveSkillId): string {
  return ActiveSkills[skillId]?.name || ''
}
