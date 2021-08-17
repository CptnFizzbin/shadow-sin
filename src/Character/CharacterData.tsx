import { GearData } from '../Gear/GearData'
import { AttributeData } from '../System/Attribute'
import { SkillData } from '../System/Skill/SkillData'

export interface CharacterData {
  name: string
  metaType: string
  nuyen: number

  alias?: string
  ethnicity?: string
  age?: number
  gender?: string
  height?: string
  weight?: string
  reputation?: string
  heat?: string
  karma: number
  misc?: string

  attributes: AttributeData[]

  skills: SkillData[]

  gear: GearData[]
}
