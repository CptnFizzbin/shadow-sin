import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface Output {
  _meta_: { version: number }
}

const migration: CharacterMigration<Record<string, unknown>, Output & Record<string, unknown>> = {
  id: "20260418",
  checkApplied: (character) => {
    const characterData = character as { _meta_?: unknown }
    return characterData._meta_ !== undefined
  },
  up: (character) => ({
    ...character,
    _meta_: { version: 1 },
  }),
}

export default migration
