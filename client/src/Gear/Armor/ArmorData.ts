import { BaseGearData, GearType } from '../GearData'
import { ArmorAttrs } from './ArmorAttrs'

export interface ArmorData extends BaseGearData {
  gearType: GearType.armor

  attributes: {
    [ArmorAttrs.defenseBonus]: number
    [ArmorAttrs.capacity]: number
  }
}
