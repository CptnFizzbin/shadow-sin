import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"

export interface ComplexFormData {
  id: string
  name: string
  rating: number
  effects?: GameEffectData[]
}
