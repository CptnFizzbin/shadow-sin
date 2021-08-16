import { GearData, GearType } from '../GearData'

export interface RccData extends GearData {
  gearType: GearType.rcc
  deviceRating: number
  dataProcessing: number
  firewall: number
}
