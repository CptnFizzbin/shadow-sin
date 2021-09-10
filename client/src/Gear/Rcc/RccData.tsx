import { RecordId } from '../../Api/Model'
import { registerAttrNames } from '../../UI/AttributeBlock'
import { GearData, GearType } from '../GearData'

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

export interface RccData extends GearData {
  gearType: GearType.rcc

  attributes: {
    [RccAttr.deviceRating]: number
    [RccAttr.dataProcessing]: number
    [RccAttr.firewall]: number
  }

  slavedAutosofts: RecordId[]
}
