import { ContactData } from '../Contacts/ContactData'
import { GearData } from '../Gear/GearData'
import { CharacterQuality } from '../Qualities/CharacterQuality'
import { CharacterSkill } from '../Skills'
import { RitualData } from '../Spells/RitualData'
import { SpellData } from '../Spells/SpellData'
import { BalanceLog } from '../System/BalanceLog'
import { AwakenedType } from './AwakenedType'
import { CharacterAttr } from './CharacterAttr'

export interface BioData {
  name: string
  metatype: string
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

  skills: CharacterSkill[]
  contacts: ContactData[]
  gear: GearData[]
  qualities: CharacterQuality[]

  spells?: SpellData[]
  spellDrainAttr?: CharacterAttr
  rituals?: RitualData[]
}

export type CharAttributes = Record<CharacterAttr, number>
