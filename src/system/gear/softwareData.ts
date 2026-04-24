import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

export interface SoftwareData extends ItemData {
  itemType: ItemType.software
  rating: number
}
