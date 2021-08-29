import { registerAttrNames } from '../../UI/AttributeBlock'
import { GearType } from '../GearData'
import { AugmentAttr, AugmentData, AugmentGrade } from './AugmentData'

export enum ControlRigAttr {
  rating = 'controlRig.rating',
}

registerAttrNames({
  [ControlRigAttr.rating]: 'Rating',
})

export interface ControlRigData extends AugmentData {
  gearType: GearType.controlRig

  attributes: {
    [AugmentAttr.grade]: AugmentGrade
    [ControlRigAttr.rating]: number
  }
}
