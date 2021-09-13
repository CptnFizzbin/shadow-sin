import { AttrValue, registerAttrNames } from '../System/Attribute'
import { BaseGearData, GearType } from './GearData'

export enum OtherGearAttr {
  medkitRating = 'medkit.rating',
}

export interface OtherGearData extends BaseGearData {
  gearType: GearType.other

  attributes?: {
    [type: string]: AttrValue
  }
}

registerAttrNames({
  [OtherGearAttr.medkitRating]: 'Rating',
})
