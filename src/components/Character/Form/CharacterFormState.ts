import type { AwakenedFormState } from "#/components/Character/Form/Resources/AwakenedFormState.ts"
import type { SkillsFormState } from "#/components/Character/Form/Skills/SkillFormState.ts"
import type { CharacterCore } from "#/lib/system/types/CharacterSheet.ts"
import type { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import type { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import type { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { SinData } from "#/lib/system/types/gear/SinData.ts"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"
import type { ImplantData } from "#/lib/system/types/gear/implantData.ts"

export interface CharacterFormState extends CharacterCore {
  characterId: string
  /** Semantic version string (e.g. "1.0.0") for the builder draft state schema. */
  version: string

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
}
