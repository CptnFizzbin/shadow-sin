import { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { AttributeBuildState } from "#/components/Character/Form/AttributeBuildState.ts"

export interface CharacterFormState {
  characterId: string,

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
  age: number
  metatype: MetatypeKey
  awakening: AwakeningType

  attributes: {
    body: AttributeBuildState
    agility: AttributeBuildState
    reaction: AttributeBuildState
    strength: AttributeBuildState
    charisma: AttributeBuildState
    intuition: AttributeBuildState
    logic: AttributeBuildState
    willpower: AttributeBuildState
    edge: AttributeBuildState
    magic: AttributeBuildState
    resonance: AttributeBuildState
  }
}
