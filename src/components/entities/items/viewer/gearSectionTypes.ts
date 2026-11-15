import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

export enum GearSection {
  Cyberware = "Cyberware",
  Weapons = "Weapons",
  Armor = "Armor",
  Vehicles = "Vehicles",
  Devices = "Devices",
  Licenses = "SINs & Licenses",
  Misc = "Misc",
}

export const sectionGearTypes: Record<GearSection, ItemType[]> = {
  [GearSection.Cyberware]: [ItemType.implant],
  [GearSection.Weapons]: [ItemType.weapon, ItemType.firearm, ItemType.firearmAccessory],
  [GearSection.Armor]: [ItemType.armor],
  [GearSection.Vehicles]: [ItemType.vehicle],
  [GearSection.Devices]: [ItemType.device, ItemType.program, ItemType.software],
  [GearSection.Licenses]: [ItemType.sin, ItemType.license],
  [GearSection.Misc]: [ItemType.other],
}

/**
 * The Items a Gear section lists as cards of their own: those of the section's types that aren't
 * Attachments of another Item in the same section, which its parent's card shows instead.
 */
export function getSectionTopLevelItems(section: GearSection, items: ItemData[]): ItemData[] {
  const sectionTypes = sectionGearTypes[section]
  const inSection = (item: ItemData | undefined) => !!item && sectionTypes.includes(item.itemType)
  const byId = new Map(items.map((item) => [item.id, item]))

  return items.filter((item) => {
    if (!inSection(item)) return false
    const parentId = item.items.parentId
    return !parentId || !inSection(byId.get(parentId))
  })
}
