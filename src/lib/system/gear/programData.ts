import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

export interface ProgramData extends ItemData {
  rating: number
  associatedSkill?: string
}

export function isProgramData(item: ItemData): item is ProgramData {
  return item.itemType === GearType.software
}
