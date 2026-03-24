import type { ItemData } from "#/lib/system/types/ItemData.ts"
import type { FirearmData } from "#/lib/system/types/gear/weaponData.ts"
import { WeaponType } from "#/lib/system/types/gear/weaponData.ts"
import type { GearEffectData } from "#/lib/system/types/gearEffectData.ts"

export enum GearType {
  armor = "armor",
  implant = "implant",
  firearm = "firearm",
  lifestyle = "lifestyle",
  software = "software",
  vehicle = "vehicle",
  weapon = "weapon",
  device = "device",
  license = "license",
  firearmAccessory = "firearmAccessory",
  sin = "sin",
  other = "other",
}

export interface GearData extends ItemData {
  type: GearType | string

  equipped?: boolean
  fixed?: boolean

  rating?: number

  wireless?: {
    enabled?: boolean
    removed?: boolean
  }

  effects?: GearEffectData[]
}

export function createGear<TGear extends GearData>(
  data: Omit<TGear, "id">,
): TGear {
  return {
    id: crypto.randomUUID(),
    ...data,
  } as TGear
}

export function createFirearm(
  data: Omit<FirearmData, "id" | "type" | "weaponType">,
): FirearmData {
  return createGear({
    ...data,
    type: GearType.weapon,
    weaponType: WeaponType.firearm,
  })
}
