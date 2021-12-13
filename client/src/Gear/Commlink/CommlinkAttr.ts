import { AttrNames } from '../../System/Attribute'

export enum CommlinkAttr {
  deviceRating = 'commlink.deviceRating',
  attributes = 'commlink.attributes',
  programSlots = 'commlink.programSlots',
}

export const CommlinkAttrNames: AttrNames = {
  [CommlinkAttr.deviceRating]: 'Device Rating',
  [CommlinkAttr.attributes]: 'Attributes',
  [CommlinkAttr.programSlots]: 'Program Slots',
}
