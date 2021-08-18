import { AttributeData } from '../../System/Attribute'
import { GearData, GearId } from '../GearData'

export interface VehicleData extends GearData {
  attributes: {
    handling: AttributeData<string | number>
    accel: AttributeData<number>
    speedInterval: AttributeData<number>
    topSpeed: AttributeData<number>
    body: AttributeData<number>
    armor: AttributeData<number>
    pilot: AttributeData<number>
    sensor: AttributeData<number>
    seat: AttributeData<number | null>
  }

  slavedTo?: GearId
  slavedAutosofts?: GearId[]
}
