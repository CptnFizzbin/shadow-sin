import { RecordId } from '../../Api/Model'
import { BaseGearData, GearType } from '../GearData'
import { VehicleAttr } from './VehicleAttr'
import { HardpointSize, SlotType } from './VehicleModData'

export interface VehicleData extends BaseGearData {
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
  pilotingSpeciality: string
  destroyed?: boolean

  hardpoints?: Record<HardpointSize, number>
  modSlots?: Record<SlotType, number>
}
