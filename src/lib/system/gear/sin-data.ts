import { GearType } from "#/lib/system/gear-type.ts"
import type { ItemData } from "#/lib/system/item-data.ts"

export interface SinData extends ItemData {
  itemType: GearType.sin
  rating: "real" | number
}

export function isSinData(item: ItemData): item is SinData {
  return item.itemType === GearType.sin
}
