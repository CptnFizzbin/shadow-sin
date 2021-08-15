import { GearData, GearType } from '../../GearData'

export interface AutosoftData extends GearData {
  gearType: GearType.autosoft
  type: string
  rating: number
  attr: string
  skill?: string
  weapon?: string
}
