import {ContactData} from '../Contacts/ContactData'
import {GearData} from '../Gear/GearData'
import {QualityData} from '../Qualities/QualityData'
import {RitualData} from '../Spells/RitualData'
import {SpellData} from '../Spells/SpellData'
import {BalanceLog} from '../System/BalanceLog'
import {SkillData} from '../System/Skill/SkillData'
import {AwakenedType} from './AwakenedType'
import {CharacterAttr} from './CharacterAttr'
import {Metatype} from './Metatypes'

export interface BioData {
  name: string
  metatype: Metatype
  awakened: AwakenedType
  role?: string
  alias?: string
  ethnicity?: string
  age?: string
  gender?: string
  height?: string
  weight?: string
}

export interface CharacterData {
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

  attributes: CharAttributes

  skills: SkillData[]
  contacts: ContactData[]
  gear: GearData[]
  qualities: QualityData[]

  spells?: (SpellData | RitualData)[]
}

export type CharAttributes = Record<CharacterAttr, number>
