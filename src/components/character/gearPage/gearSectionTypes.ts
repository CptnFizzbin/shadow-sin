import { GearType } from "#/lib/system/gearType.ts"

export enum GearSection {
  Cyberware = "Cyberware",
  Weapons = "Weapons",
  Armor = "Armor",
  Vehicles = "Vehicles",
  Devices = "Devices",
  Licenses = "SINs & Licenses",
  Misc = "Misc",
}

export const sectionGearTypes: Record<GearSection, GearType[]> = {
  [GearSection.Cyberware]: [GearType.implant],
  [GearSection.Weapons]: [GearType.weapon, GearType.firearm, GearType.firearmAccessory],
  [GearSection.Armor]: [GearType.armor],
  [GearSection.Vehicles]: [GearType.vehicle],
  [GearSection.Devices]: [GearType.device, GearType.software],
  [GearSection.Licenses]: [GearType.sin, GearType.license],
  [GearSection.Misc]: [GearType.other],
}
