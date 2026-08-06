import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { EntityDamage } from "#/system/entityData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

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

  // Max is always derived from `body`, not persisted — see EntityDamage.
  damage?: EntityDamage<DamageTrackKey.physical>
}

export function isVehicleData(item: ItemData): item is VehicleData {
  return item.itemType === ItemType.vehicle
}
