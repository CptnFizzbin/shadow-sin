import { sort } from "fast-sort"
import { produce } from "immer"

import type { RunnerData } from "#/system/runnerData.ts"
import { RUNNER_DATA_VERSION, RunnerMetaSchema } from "#/system/runnerData.ts"

import { migrations } from "./migrations.ts"

interface MigrationDraft {
  _meta_: {
    version: number
    appliedMigrations: string[]
  }
  [key: string]: unknown
}

/**
 * Run all pending migrations against a raw runner object and return the
 * migrated result.  This is the synchronous migration core shared between
 * {@link RunnerManager} (which also persists after migration) and
 * {@link yamlToRunnerData} (which only needs the in-memory result).
 */
export function applyMigrations(runner: object): RunnerData {
  const preMeta = RunnerMetaSchema.parse("_meta_" in runner ? runner._meta_ : {})
  const appliedMigrationIds = new Set(preMeta.appliedMigrations)

  const migrationsToRun = sort(migrations)
    .asc((migration) => migration.id)
    .filter((migration) => !appliedMigrationIds.has(migration.id))

  let migrated: MigrationDraft = { ...runner, _meta_: preMeta }

  for (const migration of migrationsToRun) {
    migrated = migration.up(migrated)
    appliedMigrationIds.add(migration.id)
  }

  migrated = produce(migrated, (draft) => {
    draft._meta_.version = RUNNER_DATA_VERSION
    draft._meta_.appliedMigrations = Array.from(appliedMigrationIds)

    // Defensive initialization for fields that might be missing in fixtures
    // or skipped migrations.
    draft.spirits ??= []
    draft.spells ??= []
    draft.powers ??= []
    draft.complexForms ??= []
    draft.sprites ??= []
    draft.qualities ??= []
    draft.contacts ??= []
  })

  // Using `as` here as migrations are expected to produce a fully valid RunnerData, but the type system can't verify that.
  return migrated as unknown as RunnerData
}
