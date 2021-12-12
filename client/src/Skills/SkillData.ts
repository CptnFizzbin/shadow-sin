import { KnowledgeSkillData } from './KnowledgeSkillData'
import { LanguageSkillData } from './LanguageSkillData'

import { CharacterActiveSkill } from './index'

export type SkillList = Record<string, CharacterActiveSkill>

export enum SkillType {
  active = 'active',
  language = 'language',
  knowledge = 'knowledge',
}

export interface BasicSkillData {
  type: SkillType
}

export type SkillData =
  | CharacterActiveSkill
  | LanguageSkillData
  | KnowledgeSkillData

export function isActiveSkill (skill: BasicSkillData): skill is CharacterActiveSkill {
  return skill.type === SkillType.active
}

export function isLanguageSkill (skill: BasicSkillData): skill is LanguageSkillData {
  return skill.type === SkillType.language
}

export function isKnowledgeSkill (skill: BasicSkillData): skill is KnowledgeSkillData {
  return skill.type === SkillType.knowledge
}
