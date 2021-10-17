import { registerAttrNames } from '../../System/Attribute'

export enum LicenseAttr {
  rating = 'license.rating',
}

registerAttrNames({
  [LicenseAttr.rating]: 'Rating',
})
