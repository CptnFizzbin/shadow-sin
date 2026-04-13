import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export interface SinData extends ItemData {
  itemType: ItemType.sin
  rating: "real" | number
}

export function isSinData(item: ItemData): item is SinData {
  return item.itemType === ItemType.sin
}
