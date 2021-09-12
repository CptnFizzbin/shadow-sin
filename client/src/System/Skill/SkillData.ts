export type SkillId = string;

export enum SkillType {
  active = 'active',
  language = 'language',
  knowledge = 'knowledge',
}

export interface BasicSkillData {
  dataVersion?: number
  type: SkillType
  name: string
}

export interface ActiveSkillData extends BasicSkillData {
  type: SkillType.active
  skillId: SkillId
  rank: number
  attr: string
  altAttr?: string
  speciality?: string | null
  expertise?: string | null
}

export function isActiveSkill (skill: BasicSkillData): skill is ActiveSkillData {
  return skill.type === SkillType.active
}

export interface LanguageSkillData extends BasicSkillData {
  type: SkillType.language
  rank: 'basic' | 'speciality' | 'expertise' | 'native'
}

export interface KnowledgeSkillData extends BasicSkillData {
  type: SkillType.knowledge
}

export type SkillData = ActiveSkillData | LanguageSkillData | KnowledgeSkillData

export enum ActiveSkillId {
  athletics = 'athletics',
  biotech = 'biotech',
  closeCombat = 'closeCombat',
  cracking = 'cracking',
  electronics = 'electronics',
  engineering = 'engineering',
  firearms = 'firearms',
  perception = 'perception',
  piloting = 'piloting',
  stealth = 'stealth',
}
