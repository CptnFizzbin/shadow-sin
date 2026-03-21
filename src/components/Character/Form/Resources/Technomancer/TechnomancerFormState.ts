import type { AdeptPowerData } from "#/lib/system/types/magic/adeptPowerData.ts"
import type { SpellData } from "#/lib/system/types/magic/spellData.ts"

export interface ComplexFormFormState {
  id: string
  name: string
  rating: number
}

export interface SpriteFormState {
  id: string
  name: string
  tasks: number
}

export interface AwakenedFormState {
  complexForms: ComplexFormFormState[]
  sprites: SpriteFormState[]
  spells: SpellData[]
  adeptPowers: AdeptPowerData[]
}
