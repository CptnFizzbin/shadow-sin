import { RecordId } from '../Api/Model'
import { ContactData } from '../Contacts/ContactData'
import { GearData } from '../Gear/GearData'
import { QualityData } from '../Qualities/QualityData'
import { SkillData } from '../System/Skill/SkillData'
import { CharacterAttr } from './CharacterAttr'

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
