import type { EntityKind } from "#/system/entityKind.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"

export interface ComplexFormData {
  kind: EntityKind.complexForm
  id: string
  name: string
  rating: number
  effects?: GameEffectData[]
}
