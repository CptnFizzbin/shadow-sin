import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export interface ArmorData extends ItemData {
  itemType: ItemType.armor
  ballistic: number
  impact: number
}

export function isArmorData(item: ItemData): item is ArmorData {
  return item.itemType === ItemType.armor
}
