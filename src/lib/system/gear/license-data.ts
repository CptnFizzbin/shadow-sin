import type { ItemData } from "#/lib/system/item-data.ts"
import { GearType } from "../gear-type.ts"

export interface LicenseData extends ItemData {
  itemType: GearType.license
  rating: "real" | number
}

export function isLicenseData(item: ItemData): item is LicenseData {
  return item.itemType === GearType.license
}
