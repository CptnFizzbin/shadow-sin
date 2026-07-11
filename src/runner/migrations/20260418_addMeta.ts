import { produce } from "immer"

import type { CharacterMigration } from "#/runner/characterMigration.ts"

const migration: CharacterMigration<{
  _meta_: {
    version?: number
  }
}> = {
  id: "20260418",
  // Merge into any existing _meta_ so that appliedMigrations (or other fields
  // set by the manager before this migration runs) are not lost.
  up: produce((character) => {
    character._meta_ ??= {}
    character._meta_.version ??= 1
  }),
}

export default migration
