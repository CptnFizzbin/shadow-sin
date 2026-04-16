import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export interface SoftwareData extends ItemData {
  itemType: ItemType.software
  rating: number
}

export function isSoftwareData(item: ItemData): item is SoftwareData {
  return item.itemType === ItemType.software
}
