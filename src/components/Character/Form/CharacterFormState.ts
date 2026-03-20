import type { AttrFormState } from "#/components/Character/Form/AttrFormState.ts"
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"
import type { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import type { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import type { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export interface CharacterFormState {
  characterId: string

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
  gender?: string
  weight?: string
  height?: string
  age: number
  metatype: MetatypeKey
  awakening: AwakeningType

  attributes: {
    body: AttrFormState
    agility: AttrFormState
    reaction: AttrFormState
    strength: AttrFormState
    charisma: AttrFormState
    intuition: AttrFormState
    logic: AttrFormState
    willpower: AttrFormState
    edge: AttrFormState
    magic: AttrFormState
    resonance: AttrFormState
  }

  qualities: QualityData[]

  gear: {
    sins: SinFormState[]
    licenses: LicenseFormState[]
  }
}
