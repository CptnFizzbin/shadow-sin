import { registerAttrNames } from '../../UI/AttributeBlock'
import { GearData, GearType } from '../GearData'

export enum AugmentAttr {
  grade = 'augment.grade',
  rating = 'augment.rating',
  capacity = 'augment.capacity',
  capacityCost = 'augment.capacityCost',
}

registerAttrNames({
  [AugmentAttr.grade]: 'Grade',
  [AugmentAttr.rating]: 'Rating',
  [AugmentAttr.capacity]: 'Capacity',
  [AugmentAttr.capacityCost]: 'Capacity Cost',
})

export interface AugmentData extends GearData {
  augmentSlot: AugmentSlot
  essenceCost: number
  augmentType?: AugmentType

  attributes: {
    [AugmentAttr.grade]: AugmentGrade
    [AugmentAttr.rating]?: number
    [AugmentAttr.capacity]?: number
    [AugmentAttr.capacityCost]?: number
  }
}

export function isAugment (gear: GearData): gear is AugmentData {
  return gear.gearType === GearType.augment
}

export enum AugmentType {
  controlRig = 'controlRig',
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
