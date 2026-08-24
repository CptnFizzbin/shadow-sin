import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

/**
 * Ensures `_meta_` exists as an object.  `applyMigrations` always seeds
 * `_meta_` before running any migration, so in practice this only matters
 * when `up` is called directly (e.g. in tests) against a runner that has no
 * `_meta_` at all yet.
 */
const migration: CharacterMigration<{
  _meta_: {
    version?: number
  }
}> = {
  timestamp: "2026-04-18T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft._meta_ ??= {}
    }) as { _meta_: { version?: number } }
  },
}

export default migration
