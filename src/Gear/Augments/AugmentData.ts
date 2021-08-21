import { registerAttrNames } from '../../UI/AttributeBlock'
import { GearData } from '../GearData'

export enum AugmentAttr {
  grade = 'augment.grade',
}

registerAttrNames({
  [AugmentAttr.grade]: 'Grade',
})

export interface AugmentData extends GearData {
  augmentSlot: AugmentSlot

  attributes: {
    [AugmentAttr.grade]: AugmentGrade
  }
}

export enum AugmentSlot {
  headware = 'headware',
  eyeware = 'eyeware',
  earwear = 'earwear',
  bodywear = 'bodywear',
  cyberlimb = 'cyberlimb',
  bioware = 'bioware',
}

export enum AugmentGrade {
  used = 'used',
  alpha = 'alphaware',
  beta = 'betaware',
  delta = 'deltaware'
}
