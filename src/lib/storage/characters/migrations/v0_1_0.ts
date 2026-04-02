import type { AnyCharacterMigration, BaseCharacterMetadata } from "#/lib/storage/characters/CharacterMigration.ts"

export interface Spell_V0_1_0 {
  id: string
  name: string
  type: string
  range: string
  damage: string
  description?: string
}

export interface Character_V0_1_0 extends BaseCharacterMetadata {
  spells: Spell_V0_1_0[]
}

export const migration: AnyCharacterMigration = {
  version: "0.1.0",
  up: (character) => character,
}

export default migration
