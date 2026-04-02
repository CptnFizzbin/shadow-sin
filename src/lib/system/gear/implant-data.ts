import type { ItemData } from "#/lib/system/item-data.ts"
import { GearType } from "../gear-type.ts"

export enum ImplantType {
  cyberware = "cyberware",
  bioware = "bioware",
}

export enum ImplantGrade {
  standard = "standard",
  alpha = "alpha",
  beta = "beta",
  delta = "delta",
}

export enum ImplantLocation {
  head = "head",
  eyes = "eyes",
  ears = "ears",

  torso = "torso",

  rightHand = "right hand",
  leftHand = "left hand",

  rightArm = "right arm",
  leftArm = "left arm",

  rightLeg = "right leg",
  leftLeg = "left leg",

  rightFoot = "right foot",
  leftFoot = "left foot",

}

export interface ImplantData extends ItemData {
  itemType: GearType.implant
  implantType?: ImplantType | string

  grade?: ImplantGrade
  essenceCost: number

  location?: ImplantLocation

  capacity?: number
  capacityCost?: number
}

export function isImplant(item: ItemData): item is ImplantData {
  return item.itemType === GearType.implant
}
