import { RecordId } from '../../Api/Model'
import { GearData, GearType } from '../GearData'
import { RccAttr } from './RccAttr'

export interface RccData extends GearData {
  gearType: GearType.rcc

  attributes: {
    [RccAttr.deviceRating]: number
    [RccAttr.dataProcessing]: number
    [RccAttr.firewall]: number
  }

  slavedAutosofts: RecordId[]
}
