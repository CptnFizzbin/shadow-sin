import { GearData, GearType } from '../GearData'

export interface AugmentData extends GearData {
  gearType: GearType.augment
  augmentType: AugmentType
  grade: AugmentGrade
}

export enum AugmentType {
  headware = 'aug.headware',
  eyeware = 'aug.eyeware',
  earwear = 'aug.earwear',
  bodywear = 'aug.bodywear',
  cyberlimb = 'aug.cyberlimb',
  bioware = 'aug.bioware',
}

export enum AugmentGrade {
  used = 'used',
  alpha = 'alphaware',
  beta = 'betaware',
  delta = 'deltaware'
}
