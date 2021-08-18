import { AttributeData } from '../../System/Attribute'
import { GearData, GearType } from '../GearData'

export interface RccData extends GearData {
  gearType:  GearType.rcc

  attributes: {
    deviceRating: AttributeData<number>
    dataProcessing: AttributeData<number>
    firewall: AttributeData<number>
  }
}
