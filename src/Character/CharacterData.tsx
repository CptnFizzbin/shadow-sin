import { GearData } from '../Gear/GearData'
import { AttrNames } from '../System/Attribute'
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

export const characterAttrNames: AttrNames = {
  [CharacterAttr.body]: 'Body',
  [CharacterAttr.agility]: 'Agility',
  [CharacterAttr.reaction]: 'Reaction',
  [CharacterAttr.strength]: 'Strength',
  [CharacterAttr.willpower]: 'Willpower',
  [CharacterAttr.logic]: 'Logic',
  [CharacterAttr.intuition]: 'Intuition',
  [CharacterAttr.charisma]: 'Charisma',
  [CharacterAttr.edge]: 'Edge',
  [CharacterAttr.essence]: 'Essence',
  [CharacterAttr.magic]: 'Magic',
  [CharacterAttr.resonance]: 'Resonance',
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
    [CharacterAttr.body]: number
    [CharacterAttr.agility]: number
    [CharacterAttr.reaction]: number
    [CharacterAttr.strength]: number
    [CharacterAttr.willpower]: number
    [CharacterAttr.logic]: number
    [CharacterAttr.intuition]: number
    [CharacterAttr.charisma]: number
    [CharacterAttr.edge]: number
    [CharacterAttr.essence]: number
    [CharacterAttr.magic]?: number
    [CharacterAttr.resonance]?: number
  }

  skills: SkillData[]

  gear: GearData[]
}
