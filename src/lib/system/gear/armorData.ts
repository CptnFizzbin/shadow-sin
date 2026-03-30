import type { ItemData } from "#/lib/system/ItemData.ts"
import { GearType } from "../gearType.ts"

export interface ArmorData extends ItemData {
  itemType: GearType.armor
  ballistic: number
  impact: number
}

export function isArmorData(item: ItemData): item is ArmorData {
  return item.itemType === GearType.armor
}
