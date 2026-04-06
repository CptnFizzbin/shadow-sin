import type { ItemData } from "#/lib/system/itemData.ts"
import { GearType } from "../gearType.ts"

export interface LicenseData extends ItemData {
  itemType: GearType.license
  rating: "real" | number
}

export function isLicenseData(item: ItemData): item is LicenseData {
  return item.itemType === GearType.license
}
