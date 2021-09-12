import { RecordId } from '../Api/Model'
import { ContactData } from '../Contacts/ContactData'
import { GearData } from '../Gear/GearData'
import { QualityData } from '../Qualities/QualityData'
import { SkillData } from '../System/Skill/SkillData'
import { registerAttrNames } from '../UI/AttributeBlock'

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

registerAttrNames({
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
})

export interface CharacterData {
  id: RecordId
  dataVersion: number
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

  lifestyle: {
    grade: string
    upkeep: number
    prepaid: number
  }

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
    [CharacterAttr.magic]?: number
    [CharacterAttr.resonance]?: number
  }

  skills: SkillData[]
  contacts: ContactData[]
  gear: GearData[]
  qualities: QualityData[]
}
