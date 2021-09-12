import { registerAttrNames } from '../../UI/AttributeBlock'
import { GearData, GearType } from '../GearData'

export enum SinAttr {
  rating = 'sin.rating',
}

registerAttrNames({
  [SinAttr.rating]: 'Rating',
})

export interface SinData extends GearData {
  gearType: GearType.sin
  attributes: {
    [SinAttr.rating]: number
  }
}

export function isSin (gear: GearData): gear is SinData {
  return gear.gearType === GearType.sin
}
