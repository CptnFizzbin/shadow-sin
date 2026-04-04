import { GearType } from "#/lib/system/gear-type.ts"
import type { ItemData } from "#/lib/system/item-data.ts"

export interface ProgramData extends ItemData {
  rating: number
  associatedSkill?: string
}

export function isProgramData(item: ItemData): item is ProgramData {
  return item.itemType === GearType.software
}
