import type { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import type { EntityDamage } from "#/system/model/entities/entityData.ts"

import type { ItemData } from "./itemData.ts"
import { ItemType } from "./itemType.ts"

export enum VehicleCategory {
  vehicle = "vehicle",
  drone = "drone",
}

export interface VehicleData extends ItemData {
  itemType: ItemType.vehicle
  vehicleCategory: VehicleCategory
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

  damage?: EntityDamage<DamageTrackKey.physical>
}

export function isVehicleData(item: ItemData): item is VehicleData {
  return item.itemType === ItemType.vehicle
}
