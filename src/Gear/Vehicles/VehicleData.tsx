import { registerAttrNames } from '../../UI/AttributeBlock'
import { GearData, GearId, GearType } from '../GearData'

export enum VehicleAttr {
  handling = 'vehicle.handling',
  accel = 'vehicle.accel',
  speedInterval = 'vehicle.speedInterval',
  topSpeed = 'vehicle.topSpeed',
  body = 'vehicle.body',
  armor = 'vehicle.armor',
  pilot = 'vehicle.pilot',
  sensor = 'vehicle.sensor',
  seat = 'vehicle.seat',
}

registerAttrNames({
  [VehicleAttr.handling]: 'Handling',
  [VehicleAttr.accel]: 'Accel',
  [VehicleAttr.speedInterval]: 'Speed Interval',
  [VehicleAttr.topSpeed]: 'Top Speed',
  [VehicleAttr.body]: 'Body',
  [VehicleAttr.armor]: 'armor',
  [VehicleAttr.pilot]: 'Pilot',
  [VehicleAttr.sensor]: 'Sensor',
  [VehicleAttr.seat]: 'Seat',
})

export interface VehicleData extends GearData {
  gearType: GearType.vehicle | GearType.drone

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

  slavedTo?: GearId
}
