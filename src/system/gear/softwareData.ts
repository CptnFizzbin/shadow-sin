import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface SoftwareData extends ItemData {
  itemType: ItemType.software
  rating: number
}

export function isSoftwareData(item: ItemData): item is SoftwareData {
  return item.itemType === ItemType.software
}
