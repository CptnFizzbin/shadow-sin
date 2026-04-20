import { sort } from "fast-sort"
import { produce } from "immer"

import { migrations } from "#/character/migrations.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { CHARACTER_SHEET_VERSION, CharacterMetaSchema } from "#/system/characterSheet.ts"

interface MigrationDraft {
  _meta_: {
    version: number
    appliedMigrations: string[]
  }
}

/**
 * Run all pending migrations against a raw character object and return the
 * migrated result.  This is the synchronous migration core shared between
 * {@link CharacterManager} (which also persists after migration) and
 * {@link yamlToCharacterSheet} (which only needs the in-memory result).
 */
export function applyMigrations(character: object): CharacterSheet {
  const preMeta = CharacterMetaSchema.parse("_meta_" in character ? character._meta_ : {})
  const appliedMigrationIds = new Set(preMeta.appliedMigrations)

  const migrationsToRun = sort(migrations)
    .asc((migration) => migration.id)
    .filter((migration) => !appliedMigrationIds.has(migration.id))

  let migrated: MigrationDraft = { ...character, _meta_: preMeta }

  for (const migration of migrationsToRun) {
    migrated = migration.up(migrated)
    appliedMigrationIds.add(migration.id)
  }

  migrated = produce(migrated, (draft) => {
    draft._meta_.version = CHARACTER_SHEET_VERSION
    draft._meta_.appliedMigrations = Array.from(appliedMigrationIds)
  })

  // Using `as` here as migrations are expected to produce a fully valid CharacterSheet, but the type system can't verify that.
  return migrated as CharacterSheet
}
