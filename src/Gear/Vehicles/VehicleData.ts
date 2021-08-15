import { GearData, GearId } from '../GearData'
import { Handling } from './Stats'

export interface VehicleData extends GearData {
  handling: Handling
  accel: number
  speedInterval: number
  topSpeed: number
  body: number
  armor: number
  pilot: number
  sensor: number
  seat: number | null
  slavedTo?: GearId
  slavedAutosofts?: GearId[]
  autosofts?: AutosoftData[]
}

export interface AutosoftData extends GearData {
  rating: number
  skill: string
  attr: string
}
