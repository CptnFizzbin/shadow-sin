import { AttributeData } from '../../System/Attribute'
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

export interface VehicleData extends GearData {
  attributes: {
    [VehicleAttr.handling]: AttributeData<string | number>
    [VehicleAttr.accel]: AttributeData<number>
    [VehicleAttr.speedInterval]: AttributeData<number>
    [VehicleAttr.topSpeed]: AttributeData<number>
    [VehicleAttr.body]: AttributeData<number>
    [VehicleAttr.armor]: AttributeData<number>
    [VehicleAttr.pilot]: AttributeData<number>
    [VehicleAttr.sensor]: AttributeData<number>
    [VehicleAttr.seat]: AttributeData<number | null>
  }

  slavedTo?: GearId
  slavedAutosofts?: GearId[]
}
