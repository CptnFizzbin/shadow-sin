import { sort } from "fast-sort"

import { migrations } from "#/migrations.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

/**
 * Run all pending migrations against a raw character object and return the
 * migrated result.  This is the synchronous migration core shared between
 * {@link CharacterManager} (which also persists after migration) and
 * {@link yamlToCharacterSheet} (which only needs the in-memory result).
 */
export function applyMigrations(character: object): CharacterSheet {
  let characterData: object = character

  const existingMeta = (characterData as { _meta_?: unknown })._meta_ as
    | { version?: number, appliedMigrations?: unknown }
    | undefined

  const appliedMigrationIds: string[] = Array.isArray(existingMeta?.appliedMigrations)
    ? (existingMeta.appliedMigrations as unknown[]).filter(
        (id): id is string => typeof id === "string",
      )
    : []

  characterData = {
    ...(characterData as Record<string, unknown>),
    _meta_: { version: 1, ...(existingMeta ?? {}), appliedMigrations: [...appliedMigrationIds] },
  }

  const migrationsToRun = sort(migrations)
    .asc((migration) => migration.id)
    .filter((migration) => !appliedMigrationIds.includes(migration.id))

  for (const migration of migrationsToRun) {
    characterData = migration.up(characterData)
    appliedMigrationIds.push(migration.id)
    const metaAfterMigration = (characterData as { _meta_?: unknown })._meta_
    characterData = {
      ...(characterData as Record<string, unknown>),
      _meta_: {
        version: 1,
        ...(typeof metaAfterMigration === "object" && metaAfterMigration !== null
          ? (metaAfterMigration as Record<string, unknown>)
          : {}),
        appliedMigrations: [...appliedMigrationIds],
      },
    }
  }

  // Using `as` here as migrations are expected to produce a fully valid CharacterSheet, but the type system can't verify that.
  return characterData as CharacterSheet
}
