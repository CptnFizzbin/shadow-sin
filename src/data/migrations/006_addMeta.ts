import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 6

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
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      draft._meta_ ??= {}
    }) as { _meta_: { version?: number } }
  },
}

export default migration
