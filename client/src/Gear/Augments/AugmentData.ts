import { BaseGearData, GearData, GearType } from '../GearData'
import { AugmentAttr } from './AugmentAttr'

export interface AugmentData extends BaseGearData {
  augmentType?: AugmentType

  attributes: {
    [AugmentAttr.grade]: AugmentGrade
    [AugmentAttr.essenceCost]: number
    [AugmentAttr.slot]: AugmentSlot
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
  bodyware = 'bodyware',
  cyberlimb = 'cyberlimb',
  bioware = 'bioware',
}

export enum AugmentGrade {
  used = 'used',
  alpha = 'alphaware',
  beta = 'betaware',
  delta = 'deltaware'
}
