import { AttrNames } from '../../System/Attribute'

export enum RccAttr {
  deviceRating = 'rcc.deviceRating',
  dataProcessing = 'rcc.dataProcessing',
  firewall = 'rcc.firewall'
}

export const RccAttrNames: AttrNames = {
  [RccAttr.deviceRating]: 'Device Rating',
  [RccAttr.dataProcessing]: 'Data Processing',
  [RccAttr.firewall]: 'Firewall',
}
