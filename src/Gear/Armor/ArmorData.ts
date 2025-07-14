import { BaseGearData, GearType } from "../GearData"
import { ArmorAttr } from "./ArmorAttr"

export interface ArmorData extends BaseGearData {
  gearType: GearType.armor

  attributes: {
    [ArmorAttr.defenseBonus]: number
    [ArmorAttr.capacity]: number
  }
}
