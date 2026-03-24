import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type { GearEffectData } from "#/lib/system/types/gearEffectData.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

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

export interface GearData {
  id: string
  parentId?: string

  name: string
  type: GearType | string

  notes?: string
  equipped?: boolean
  fixed?: boolean

  availability?: AvailablityInfo
  source?: SourceData
  rating?: number
  cost?: number

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
