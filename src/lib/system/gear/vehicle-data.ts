import type { ItemData } from "#/lib/system/item-data.ts"
import { GearType } from "../gear-type.ts"

export interface VehicleData extends ItemData {
  itemType: GearType.vehicle
  vehicleType: string
  model?: string

  handling: number
  accel: `${number}/${number}`
  pilot: number
  speed: number
  body: number
  armor: number
  sensor: number

  seats?: number

  damage?: {
    physical: {
      current: number
      max: number
    }
  }
}

export function isVehicleData(item: ItemData): item is VehicleData {
  return item.itemType === GearType.vehicle
}
