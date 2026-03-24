import type { AttrLimits } from "#/components/Character/Form/AttrFormState.ts"
import type { ImplantFormState } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"
import type { AwakenedFormState } from "#/components/Character/Form/Resources/AwakenedFormState.ts"
import type { SkillsFormState } from "#/components/Character/Form/Skills/SkillFormState.ts"
import type { CharacterSheet } from "#/lib/system/types/CharacterSheet.ts"
import type { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import type { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export interface CharacterFormState extends CharacterSheet {
  characterId: string
  /** Semantic version string (e.g. "1.0.0") for the builder draft state schema. */
  version: string

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

  /**
   * Attribute limit constraints (min/max/augMax) derived from metatype and
   * awakening. Stored separately from the attribute values so that
   * `attributes` can use the unified `Record<AttributeKey, number>` format
   * shared with `PlayerCharacterData` (via `CharacterSheet`).
   */
  attributeLimits: Record<AttributeKey, AttrLimits>

  skills: SkillsFormState

  awakened: AwakenedFormState

  gear: {
    sins: SinFormState[]
    licenses: LicenseFormState[]
    weapons: GearItemFormState[]
    armor: GearItemFormState[]
    vehicles: GearItemFormState[]
    cyberware: ImplantFormState[]
    implantMods: GearItemFormState[]
    devices: GearItemFormState[]
    misc: GearItemFormState[]
  }
}
