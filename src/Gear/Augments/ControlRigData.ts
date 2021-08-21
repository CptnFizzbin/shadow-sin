import { GearData, GearType } from '../GearData'
import { AugmentAttr, AugmentGrade, AugmentType } from './AugmentData'

export enum ControlRigAttr {
  grade = 'controlRig.grade',
  rating = 'controlRig.rating',
}

export interface ControlRigData extends GearData {
  gearType: GearType.controlRig

  attributes: {
    [AugmentAttr.type]: AugmentType
    [AugmentAttr.grade]: AugmentGrade
    [ControlRigAttr.rating]: number
  }
}
