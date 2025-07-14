import { BaseGearData, GearData, GearType } from "../GearData"
import { SinAttr } from "./SinAttr"

export interface SinData extends BaseGearData {
  gearType: GearType.sin
  attributes: {
    [SinAttr.rating]: number
  }
}

export function isSin(gear: GearData): gear is SinData {
  return gear.gearType === GearType.sin
}
