import { produce } from "immer"

import type { BaseCharacterMetadata, CharacterMigration } from "#/lib/storage/characters/CharacterMigration.ts"
import type { Character_V0_1_0 } from "#/lib/storage/characters/migrations/v0_1_0.ts"

export interface Spell_V0_2_0 {
  theshold: string
}

export interface Character_V0_2_0 extends BaseCharacterMetadata {
  version: string
  spells: Spell_V0_2_0[]
}

const migation: CharacterMigration<Character_V0_1_0, Character_V0_2_0> = {
  version: "0.2.0",
  up: (character) => produce(character, (prev) => {
    prev.spells = prev.spells.map((spell) => {
      spell.theshold ??= ""
      return spell
    })
  }),
}

export default migation
