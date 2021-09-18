import { RecordId } from '../Api/Model'
import { ContactData } from '../Contacts/ContactData'
import { GearData } from '../Gear/GearData'
import { QualityData } from '../Qualities/QualityData'
import { BalanceLog } from '../System/BalanceLog'
import { SkillData } from '../System/Skill/SkillData'
import { CharacterAttr } from './CharacterAttr'

export interface BioData {
  name: string
  metaType: string
  role?: string
  alias?: string
  ethnicity?: string
  age?: number
  gender?: string
  height?: string
  weight?: string
}

export interface CharacterData {
  id: RecordId
  dataVersion: 3
  bio: BioData

  reputation?: string
  heat?: string
  nuyen: BalanceLog
  karma: BalanceLog

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
