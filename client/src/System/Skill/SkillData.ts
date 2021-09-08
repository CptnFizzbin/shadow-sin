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
  speciality: string | null
  expertise: string | null
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
  firearms = 'active.firearms',
  electronics = 'active.electronics',
  cracking = 'active.cracking',
  piloting = 'active.piloting',
  engineering = 'active.engineering',
}
