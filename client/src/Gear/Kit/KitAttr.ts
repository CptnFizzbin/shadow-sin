import { registerAttrNames } from '../../System/Attribute'

export enum KitAttr {
  medkitRating = 'medkit.rating',
}

registerAttrNames({
  [KitAttr.medkitRating]: 'Rating',
})
