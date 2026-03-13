import type { GearData } from "./gearData.ts"
import type { GearType } from "./gearData.ts"

export interface ArmorData extends GearData {
  type: GearType.armor
  ballistic: number
  impact: number
}
