import { produce } from "immer"

import type { CharacterMigration } from "#/lib/storage/characters/CharacterMigration.ts"
import { SpellCategory, SpellDuration } from "#/lib/system/magic/spellData.ts"

type SpellV1 = {
  id: string
  name: string
  type: string
  range: string
  damage: string
  description?: string
}

type CharacterV1 = {
  version: string
  spells: SpellV1[]
}

type CharacterV2 = CharacterV1 & {
  spells: (SpellV1 & {
    category: string
    drainValueMod: number
    dealsDamage: boolean
    duration: string
    voluntaryTargetsOnly: boolean
  })[]
}

const v0_2_0: CharacterMigration<CharacterV1, CharacterV2> = {
  version: "0.2.0",
  up: (character) =>
    produce(character as CharacterV2, (draft) => {
      draft.version = "0.2.0"
      for (const spell of draft.spells ?? []) {
        spell.category ??= SpellCategory.Combat
        spell.drainValueMod ??= 0
        spell.dealsDamage ??= false
        spell.duration ??= SpellDuration.Instantaneous
        spell.voluntaryTargetsOnly ??= false
      }
    }),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const migrations: CharacterMigration<any, any>[] = [v0_2_0]
