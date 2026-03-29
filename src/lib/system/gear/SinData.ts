import type { ItemData } from "#/lib/system/ItemData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export interface SinData extends ItemData {
  itemType: GearType.sin
  rating: "real" | number
}

export function isSinData(item: ItemData): item is SinData {
  return item.itemType === GearType.sin
}
