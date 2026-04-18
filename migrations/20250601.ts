import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface GearItem {
  id: string
  name: string
  type: string
  range: string
  damage: string
  description?: string
}

const migration: CharacterMigration<{
  spells?: GearItem[]
}> = {
  id: "20250601",
  checkApplied: () => true,
  up: (character) => character,
}

export default migration
