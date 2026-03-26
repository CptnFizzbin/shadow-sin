import type { GearData } from "#/lib/system/gear/gearData.ts"

export interface ProgramData extends GearData {
  rating: number
  associatedSkill?: string
}
