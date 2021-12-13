import { CharacterAttr } from '../Character/CharacterAttr'
import { MetatypeId } from '../Character/Metatype'
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

export const ActiveSkillIds: Record<string, ActiveSkillId> = {
  ...CrbSkillId,
}

export const ActiveSkills: Record<ActiveSkillId, ActiveSkill> = {
  ...CrbSkills,
}

const ActiveSkillNames: Record<MetatypeId, string> = Object.entries(ActiveSkills)
  .reduce((names, [id, skill]) => ({ ...names, [id]: skill.name }), {})

export function formatSkill (skillId: ActiveSkillId): string {
  return ActiveSkillNames[skillId] || ''
}
