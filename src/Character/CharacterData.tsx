import { GearData } from '../Gear/GearData'
import { AttributeData } from '../System/Attribute'
import { SkillData } from '../System/Skill/SkillData'

export enum CharacterAttr {
  body = 'char.body',
  agility = 'char.agility',
  reaction = 'char.reaction',
  strength = 'char.strength',
  willpower = 'char.willpower',
  logic = 'char.logic',
  intuition = 'char.intuition',
  charisma = 'char.charisma',
  edge = 'char.edge',
  essence = 'char.essence',
  magic = 'char.magic',
  resonance = 'char.resonance',
}

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
    [CharacterAttr.body]: AttributeData<number>
    [CharacterAttr.agility]: AttributeData<number>
    [CharacterAttr.reaction]: AttributeData<number>
    [CharacterAttr.strength]: AttributeData<number>
    [CharacterAttr.willpower]: AttributeData<number>
    [CharacterAttr.logic]: AttributeData<number>
    [CharacterAttr.intuition]: AttributeData<number>
    [CharacterAttr.charisma]: AttributeData<number>
    [CharacterAttr.edge]: AttributeData<number>
    [CharacterAttr.essence]: AttributeData<number>
    [CharacterAttr.magic]?: AttributeData<number>
    [CharacterAttr.resonance]?: AttributeData<number>
  }

  skills: SkillData[]

  gear: GearData[]
}
