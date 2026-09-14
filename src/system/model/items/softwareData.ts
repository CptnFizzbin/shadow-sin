import type { ItemData } from "./itemData.ts"
import type { ItemType } from "./itemType.ts"

export interface SoftwareData extends ItemData {
  itemType: ItemType.software
  rating: number
}
