import { GearType } from '../GearData'
import { VehicleData } from './VehicleData'

export interface DroneData extends VehicleData {
  gearType: GearType.drone
  size: string
}
