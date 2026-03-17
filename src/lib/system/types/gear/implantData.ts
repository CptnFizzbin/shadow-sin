import type { GearData, GearType } from "./gearData.ts";

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
  rightHand = "right hand",
  leftHand = "left hand",

  rightArm = "right arm",
  leftArm = "left arm",

  rightLeg = "right leg",
  leftLeg = "left leg",

  rightFoot = "right foot",
  leftFoot = "left foot",

  torso = "torso",
  eyes = "eyes",
  ears = "ears",
}

export interface ImplantData extends GearData {
  type: GearType.implant;
  implantType: ImplantType | string;
  essenceCost: number;
  rating?: number;
  grade?: ImplantGrade | string;

  location: ImplantLocation | string;

  capacity?: number;

  attachments?: ImplantAttachmentData[];
}

export interface ImplantAttachmentData extends GearData {
  type: string;

  essenceCost: number;
  capacityCost: number;

  rating?: number;
}
