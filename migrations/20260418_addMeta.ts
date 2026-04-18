import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface Output {
  _meta_: { version: number }
}

const migration: CharacterMigration<Record<string, unknown>, Output & Record<string, unknown>> = {
  id: "20260418",
  // Merge into any existing _meta_ so that appliedMigrations (or other fields
  // set by the manager before this migration runs) are not lost.
  up: (character) => ({
    ...character,
    _meta_: {
      ...((typeof character._meta_ === "object" && character._meta_ !== null)
        ? character._meta_
        : {}),
      version: 1,
    },
  }),
}

export default migration
