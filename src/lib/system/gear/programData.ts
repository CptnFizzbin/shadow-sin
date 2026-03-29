import type { ItemData } from "#/lib/system/ItemData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export interface ProgramData extends ItemData {
  rating: number
  associatedSkill?: string
}

export function isProgramData(item: ItemData): item is ProgramData {
  return item.itemType === GearType.software
}
