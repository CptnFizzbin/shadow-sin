import { GearType } from "#/lib/system/gear-type.ts"
import type { ItemData } from "#/lib/system/item-data.ts"

export interface SoftwareData extends ItemData {
  itemType: GearType.software
  rating: number
}

export function isSoftwareData(item: ItemData): item is SoftwareData {
  return item.itemType === GearType.software
}
