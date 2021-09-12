import { RecordId } from '../Api/Model'
import { AttrList } from '../System/Attribute'
import { Source } from '../System/Source'
import { Effect } from './Effect'

export type Cost = number
export type Availability = {
  rarity: number
  illegal?: boolean
  license?: boolean
}

export enum GearType {
  armor = 'armor',
  armorMod = 'armorMod',
  augment = 'augment',
  autosoft = 'autosoft',
  license = 'license',
  rcc = 'rcc',
  sin = 'sin',
  vehicle = 'vehicle',
  vehicleMod = 'vehicleMod',
  weapon = 'weapon',
  weaponMod = 'weaponMod',

  other = 'other',
}

export interface GearData {
  id: RecordId
  source?: Source
  gearType: GearType
  name: string
  type: string
  avail?: Availability
  cost?: Cost
  capacity?: number
  quantity?: number

  attributes?: AttrList
  attachedTo?: RecordId

  wirelessBonus?: {
    enabled: boolean
    description: string
    effects?: Effect[]
  }

  description?: string
  effects?: Effect[]

  [key: string]: unknown
}

export const formatAvail = (avail: Availability): string => {
  return `${avail.rarity}${avail.illegal ? '(i)' : ''}${avail.license ? '(L)' : ''}`
}

export const collectGearEffects = (gear: GearData[]): Effect[] => {
  return gear
    .filter(gear => gear.effects)
    .flatMap(gear => gear.effects as Effect[])
}
