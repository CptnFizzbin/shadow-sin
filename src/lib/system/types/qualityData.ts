import type { GearEffectData } from "#/lib/system/types/gearEffectData.ts"

export interface QualityData {
  name: string;
  description: string;
  effects?: GearEffectData[]
}
