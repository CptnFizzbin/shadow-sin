import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface SinData extends ItemData {
  itemType: ItemType.sin
  rating: "real" | number
}

export function isSinData(item: ItemData): item is SinData {
  return item.itemType === ItemType.sin
}
