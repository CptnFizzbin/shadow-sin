import { registerAttrNames } from '../../System/Attribute'

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
