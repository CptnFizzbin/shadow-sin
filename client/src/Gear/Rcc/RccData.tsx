import { RecordId } from '../../Api/Model'
import { BaseGearData, GearData, GearType } from '../GearData'
import { RccAttr } from './RccAttr'

export interface RccData extends BaseGearData {
  gearType: GearType.rcc

  attributes: {
    [RccAttr.deviceRating]: number
    [RccAttr.dataProcessing]: number
    [RccAttr.firewall]: number
  }

  slavedAutosofts: RecordId[]
}
