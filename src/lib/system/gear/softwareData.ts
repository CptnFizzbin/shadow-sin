import type { ItemData } from "#/lib/system/ItemData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export interface SoftwareData extends ItemData {
  itemType: GearType.software
  rating: number
}

export function isSoftwareData(item: ItemData): item is SoftwareData {
  return item.itemType === GearType.software
}
