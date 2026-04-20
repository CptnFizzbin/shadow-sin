import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface LicenseData extends ItemData {
  itemType: ItemType.license
  rating: "real" | number
}

export function isLicenseData(item: ItemData): item is LicenseData {
  return item.itemType === ItemType.license
}
