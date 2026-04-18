import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface Spell_V0_1_0 {
  id: string
  name: string
  type: string
  range: string
  damage: string
  description?: string
}

const migration: CharacterMigration<{
  spells?: Spell_V0_1_0[]
}> = {
  id: "20250601",
  checkApplied: () => true,
  up: (character) => character,
}

export default migration
