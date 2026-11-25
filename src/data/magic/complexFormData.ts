import type { EntityKind } from "#data/entities/entityKind.ts"
import type { GameEffectData } from "#data/gameEffects/gameEffectData.ts"

export interface ComplexFormData {
  kind: EntityKind.complexForm
  id: string
  name: string
  rating: number
  effects?: GameEffectData[]
}
