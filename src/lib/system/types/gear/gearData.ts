import type { ItemData } from "#/lib/system/types/ItemData.ts"
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
  itemType: GearType | string

  notes?: string
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
  return { ...data, id: crypto.randomUUID() } as TGear
}
