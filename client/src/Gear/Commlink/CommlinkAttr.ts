import { registerAttrNames } from '../../System/Attribute'

export enum CommlinkAttr {
  deviceRating = 'commlink.deviceRating',
  attributes = 'commlink.attributes',
  programSlots = 'commlink.programSlots',
}

registerAttrNames({
  [CommlinkAttr.deviceRating]: 'Device Rating',
  [CommlinkAttr.attributes]: 'Attributes',
  [CommlinkAttr.programSlots]: 'Program Slots',
})
