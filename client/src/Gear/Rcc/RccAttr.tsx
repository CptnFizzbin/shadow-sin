import { registerAttrNames } from '../../System/Attribute'

export enum RccAttr {
  deviceRating = 'rcc.deviceRating',
  dataProcessing = 'rcc.dataProcessing',
  firewall = 'rcc.firewall'
}

registerAttrNames({
  [RccAttr.deviceRating]: 'Device Rating',
  [RccAttr.dataProcessing]: 'Data Processing',
  [RccAttr.firewall]: 'Firewall',
})
