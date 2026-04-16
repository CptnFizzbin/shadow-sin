import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export interface LicenseData extends ItemData {
  itemType: ItemType.license
  rating: "real" | number
}

export function isLicenseData(item: ItemData): item is LicenseData {
  return item.itemType === ItemType.license
}
