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

  attributes: {
    body: AttributeData<number>
    agility: AttributeData<number>
    reaction: AttributeData<number>
    strength: AttributeData<number>
    willpower: AttributeData<number>
    logic: AttributeData<number>
    intuition: AttributeData<number>
    charisma: AttributeData<number>
    edge: AttributeData<number>
    essence: AttributeData<number>
    magic?: AttributeData<number>
    resonance?: AttributeData<number>
  }

  skills: SkillData[]

  gear: GearData[]
}
