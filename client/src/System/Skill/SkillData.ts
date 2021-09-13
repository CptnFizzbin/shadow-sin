import { ActiveSkillData } from './ActiveSkill/ActiveSkillData'
import { KnowledgeSkillData } from './KnowledgeSkill/KnowledgeSkillData'
import { LanguageSkillData } from './LanguageSkill/LanguageSkillData'

export enum SkillType {
  active = 'active',
  language = 'language',
  knowledge = 'knowledge',
}

export interface BasicSkillData {
  type: SkillType
}

export type SkillData =
  | ActiveSkillData
  | LanguageSkillData
  | KnowledgeSkillData
