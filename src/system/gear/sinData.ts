import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { Rating } from "#/system/rating.ts"

export interface SinData extends ItemData {
  itemType: ItemType.sin
  rating: Rating<"real">
}

export function isSinData(item: ItemData): item is SinData {
  return item.itemType === ItemType.sin
}
