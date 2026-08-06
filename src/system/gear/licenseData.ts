import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { Rating } from "#/system/rating.ts"

export interface LicenseData extends ItemData {
  itemType: ItemType.license
  rating: Rating<"real">
}

export function isLicenseData(item: ItemData): item is LicenseData {
  return item.itemType === ItemType.license
}
