import { AttrNames } from "../../System/Attribute"

export enum AugmentAttr {
  grade = "augment.grade",
  rating = "augment.rating",
  slot = "augment.slot",
  essenceCost = "augment.essenceCost",
  capacity = "augment.capacity",
  capacityCost = "augment.capacityCost",
}

export const AugmentAttrNames: AttrNames = {
  [AugmentAttr.grade]: "Grade",
  [AugmentAttr.rating]: "Rating",
  [AugmentAttr.slot]: "Slot",
  [AugmentAttr.essenceCost]: "Essence",
  [AugmentAttr.capacity]: "Capacity",
  [AugmentAttr.capacityCost]: "Capacity Cost",
}
