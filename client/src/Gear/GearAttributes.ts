import { AttrNames } from '../System/Attribute'
import { ArmorAttrNames } from './Armor/ArmorAttr'
import { AugmentAttrNames } from './Augments/AugmentAttr'
import { CommlinkAttrNames } from './Commlink/CommlinkAttr'
import { KitAttrNames } from './Kit/KitAttr'
import { LicenseAttrNames } from './License/LicenseAttr'
import { SinAttrNames } from './License/SinAttr'
import { OtherGearAttrNames } from './OtherGearData'
import { RccAttrNames } from './Rcc/RccAttr'
import { AutosoftAttrNames } from './Software/Autosoft/AutosoftAttr'
import { VehicleAttrNames } from './Vehicles/VehicleAttr'
import { WeaponAttrNames } from './Weapons/WeaponAttr'

export const GearAttributes: AttrNames = {
  ...ArmorAttrNames,
  ...AugmentAttrNames,
  ...CommlinkAttrNames,
  ...KitAttrNames,
  ...LicenseAttrNames,
  ...SinAttrNames,
  ...RccAttrNames,
  ...AutosoftAttrNames,
  ...VehicleAttrNames,
  ...WeaponAttrNames,
  ...OtherGearAttrNames,
}
