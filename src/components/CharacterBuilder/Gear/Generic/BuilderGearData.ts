import type { GearType } from "#/lib/system/types/gear/gearData.ts"

export interface BuilderGearData {
  id: string
  parentId?: string

  type: GearType | string

  cost?: number
}
