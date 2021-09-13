import { BaseGearData, GearType } from '../GearData'

export enum ModType {
  other = 'vehicleMod.other',
  riggerInterface = 'vehicleMod.riggerInterface',
  stdWeaponMount = 'vehicleMod.stdWeaponMount',
  heavyWeaponMount = 'vehicleMod.heavyWeaponMount',
  manualControl = 'vehicleMod.manualControl',
}

export interface VehicleModData extends BaseGearData {
  gearType: GearType.vehicleMod
  modType: ModType
}
