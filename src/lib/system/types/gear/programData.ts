import type { GearData } from "#/lib/system/types/gear/gearData.ts"

export interface ProgramData extends GearData {
  rating: number
  associatedSkill?: string
}
