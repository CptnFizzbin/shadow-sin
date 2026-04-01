import type { GameEffectData } from "#/lib/system/GameEffects/GameEffectData.ts"

export interface ComplexFormData {
  id: string
  name: string
  rating: number
  effects?: GameEffectData[]
}
