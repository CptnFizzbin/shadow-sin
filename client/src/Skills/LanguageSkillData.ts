import { BasicSkillData, SkillType } from './SkillData'

export interface LanguageSkillData extends BasicSkillData {
  type: SkillType.language
  name: string
  rank: 'basic' | 'speciality' | 'expertise' | 'native'
}
