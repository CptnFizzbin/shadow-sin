import { RecordId } from '../Api/Model'
import { AttrList } from '../System/Attribute'
import { Effect } from '../System/Effect'
import { Source } from '../System/Source'
import { ArmorData } from './Armor/ArmorData'
import { ArmorModData } from './Armor/ArmorModData'
import { AugmentData } from './Augments/AugmentData'
import { Availability } from './Availability'
import { LicenseData } from './License/LicenseData'
import { SinData } from './License/SinData'
import { OtherGearData } from './OtherGearData'
import { RccData } from './Rcc/RccData'
import { AutosoftData } from './Software/Autosoft/AutosoftData'
import { VehicleData } from './Vehicles/VehicleData'
import { VehicleModData } from './Vehicles/VehicleModData'
import { WeaponData } from './Weapons/WeaponData'
import { WeaponModData } from './Weapons/WeaponModData'

export type Cost = number

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

export interface BaseGearData {
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
  }

  description?: string
  effects?: Effect[]

  [key: string]: unknown
}

export type GearData =
  | OtherGearData
  | ArmorData
  | ArmorModData
  | AugmentData
  | AutosoftData
  | LicenseData
  | RccData
  | SinData
  | VehicleData
  | VehicleModData
  | WeaponData
  | WeaponModData
