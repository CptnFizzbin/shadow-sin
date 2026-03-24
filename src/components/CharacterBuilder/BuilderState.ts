import type { AttrLimits } from "#/components/Character/Form/AttrFormState.ts"
import type { AwakenedFormState } from "#/components/Character/Form/Resources/AwakenedFormState.ts"
import type { SkillsFormState } from "#/components/Character/Form/Skills/SkillFormState.ts"
import type { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import type { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { ContactData } from "#/lib/system/types/contactData.ts"
import type { SinData } from "#/lib/system/types/gear/SinData.ts"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"
import type { ImplantData } from "#/lib/system/types/gear/implantData.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

/**
 * The complete builder draft state — character data AND build-tracking
 * metadata — held in a single independent store. It is intentionally
 * decoupled from CharacterSheet so that the two can evolve separately.
 */
export interface BuilderState {
  // ── Identity ──────────────────────────────────────────────────────────────
  characterId: string
  /** Semantic version string (e.g. "1.0.0") for the builder draft schema. */
  version: string

  // ── Character data (flat / builder-friendly shapes) ───────────────────────
  name: string
  alias: string
  lifestyle: LifestyleType
  lifestyleMonths: number
  gender?: string
  weight?: string
  height?: string
  age: number
  metatype: MetatypeKey
  awakening: AwakeningType

  attributes: Record<AttributeKey, number>
  qualities: QualityData[]
  contacts: ContactData[]

  skills: SkillsFormState
  awakened: AwakenedFormState

  gear: {
    sins: SinData[]
    weapons: GearData[]
    armor: GearData[]
    vehicles: GearData[]
    cyberware: ImplantData[]
    devices: GearData[]
    misc: GearData[]
  }

  // ── Builder metadata ───────────────────────────────────────────────────────
  buildPoints: {
    total: number
    spent: {
      metatype: number
      qualities: number
      attributes: number
      skills: number
      gear: number
    }
  }
  attributeLimits: Record<AttributeKey, AttrLimits>
}
