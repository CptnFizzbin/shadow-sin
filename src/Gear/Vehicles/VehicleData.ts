import { AttrNames } from '../../System/Attribute'
import { GearData, GearId } from '../GearData'

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

export const VehicleAttrNames: AttrNames = {
  [VehicleAttr.handling]: 'Handling',
  [VehicleAttr.accel]: 'Accel',
  [VehicleAttr.speedInterval]: 'Speed Interval',
  [VehicleAttr.topSpeed]: 'Top Speed',
  [VehicleAttr.body]: 'Body',
  [VehicleAttr.armor]: 'armor',
  [VehicleAttr.pilot]: 'Pilot',
  [VehicleAttr.sensor]: 'Sensor',
  [VehicleAttr.seat]: 'Seat',
}

export interface VehicleData extends GearData {
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
