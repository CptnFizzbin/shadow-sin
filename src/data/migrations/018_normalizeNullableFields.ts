import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { LifestyleType } from "#/system/lifestyleType.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"

const VERSION = 18

type NormalizeNullableFieldsCharacter = {
  profile?: {
    archetype?: string | null
    description?: string | null
    personality?: string | null
    lifestyle?: { quality: LifestyleType, monthsPaid: number } | null
  }
  biology?: {
    gender?: string | null
    age?: number | null
    weight?: string | null
    height?: string | null
  }
  initiative?: {
    passesCompleted?: number[]
  }
  tradition?: TraditionData | null
}

const migration: CharacterMigration<NormalizeNullableFieldsCharacter> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      if (draft.profile) {
        draft.profile.archetype ??= null
        draft.profile.description ??= null
        draft.profile.personality ??= null
        draft.profile.lifestyle ??= null
      }

      if (draft.biology) {
        draft.biology.gender ??= null
        draft.biology.age ??= null
        draft.biology.weight ??= null
        draft.biology.height ??= null
      }

      draft.initiative ??= { passesCompleted: [] }
      draft.tradition ??= null
    })
  },
}

export default migration
