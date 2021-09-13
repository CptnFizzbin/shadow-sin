import { BasicSkillData, SkillType } from '../SkillData'

export interface KnowledgeSkillData extends BasicSkillData {
  type: SkillType.knowledge
  name: string
}
