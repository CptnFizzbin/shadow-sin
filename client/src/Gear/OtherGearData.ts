import { AttrNames, AttrValue } from '../System/Attribute'
import { BaseGearData, GearType } from './GearData'

export interface OtherGearData extends BaseGearData {
  gearType: GearType.other

  attributes?: {
    [type: string]: AttrValue
  }
}

export enum OtherGearAttr {
  capacity = 'other.capacity',
  capacityCost = 'other.capacityCost',
  rating = 'other.rating',
}

export const OtherGearAttrNames: AttrNames = {
  [OtherGearAttr.capacity]: 'Capacity',
  [OtherGearAttr.capacityCost]: 'Capacity Cost',
  [OtherGearAttr.rating]: 'Rating',
}
