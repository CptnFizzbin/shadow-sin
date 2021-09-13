import { BaseGearData, GearData, GearType } from '../GearData'
import { AugmentAttr } from './AugmentAttr'

export interface AugmentData extends BaseGearData {
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
