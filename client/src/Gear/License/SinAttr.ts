import { registerAttrNames } from '../../System/Attribute'

export enum SinAttr {
  rating = 'sin.rating',
}

registerAttrNames({
  [SinAttr.rating]: 'Rating',
})
