import { RecordId } from '../../Api/Model'
import { GearData, GearType } from '../GearData'
import { VehicleAttr } from './VehicleAttr'

export interface VehicleData extends GearData {
  gearType: GearType.vehicle

  attributes: {
    [VehicleAttr.handling]: string | number
    [VehicleAttr.accel]: number
    [VehicleAttr.speedInterval]: number
    [VehicleAttr.topSpeed]: number
    [VehicleAttr.body]: number
    [VehicleAttr.armor]: number
    [VehicleAttr.pilot]: number
    [VehicleAttr.sensor]: number
    [VehicleAttr.seat]: number | null
  }

  slavedTo?: RecordId
}
