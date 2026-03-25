import type { GearData, GearType } from "./gearData.ts"

export interface ArmorData extends GearData {
  itemType: GearType.armor
  ballistic: number
  impact: number
}
