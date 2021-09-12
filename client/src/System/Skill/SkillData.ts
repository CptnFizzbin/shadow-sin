export type SkillId = string;

export interface SkillList {
  [skillId: string]: number
}

export type SkillNames = {
  [skillId: string]: string
}

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

const skillNames: SkillNames = {
  [ActiveSkillId.athletics]: 'Athletics',
  [ActiveSkillId.biotech]: 'Biotech',
  [ActiveSkillId.closeCombat]: 'Close Combat',
  [ActiveSkillId.cracking]: 'Cracking',
  [ActiveSkillId.electronics]: 'Electronics',
  [ActiveSkillId.engineering]: 'Engineering',
  [ActiveSkillId.firearms]: 'Firearms',
  [ActiveSkillId.perception]: 'Perception',
  [ActiveSkillId.piloting]: 'Piloting',
  [ActiveSkillId.stealth]: 'Stealth',
}

export const formatSkill = (skillId: string): string => {
  return skillNames[skillId] || skillId
}
