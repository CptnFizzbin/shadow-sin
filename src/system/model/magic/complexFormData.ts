import type { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"

export interface ComplexFormData {
  kind: EntityKind.complexForm
  id: string
  name: string
  rating: number
  effects?: GameEffectData[]
}
