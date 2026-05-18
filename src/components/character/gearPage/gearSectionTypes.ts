import { ItemType } from "#/system/itemType.ts"

export enum GearSection {
  Cyberware = "Cyberware",
  Weapons = "Weapons",
  Armor = "Armor",
  Vehicles = "Vehicles",
  Devices = "Devices",
  Foci = "Foci",
  Licenses = "SINs & Licenses",
  Misc = "Misc",
}

export const sectionGearTypes: Record<GearSection, ItemType[]> = {
  [GearSection.Cyberware]: [ItemType.implant],
  [GearSection.Weapons]: [ItemType.weapon, ItemType.firearm, ItemType.firearmAccessory],
  [GearSection.Armor]: [ItemType.armor],
  [GearSection.Vehicles]: [ItemType.vehicle],
  [GearSection.Devices]: [ItemType.device, ItemType.program, ItemType.software],
  [GearSection.Foci]: [ItemType.focus],
  [GearSection.Licenses]: [ItemType.sin, ItemType.license],
  [GearSection.Misc]: [ItemType.other],
}
