import { sort } from "fast-sort"
import { produce } from "immer"

import type { RunnerData } from "#/system/runnerData.ts"
import { RunnerMetaSchema } from "#/system/runnerData.ts"

import { CURRENT_RUNNER_VERSION, migrations } from "./migrations.ts"

interface MigrationDraft {
  _meta_: {
    version: number
  }
  // `any` rather than `unknown` so the final single `as RunnerData` cast below is structurally
  // valid — migrations are expected to produce a fully valid RunnerData, but the type system
  // can't verify that.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const migrationsInOrder = sort(migrations).asc((migration) => migration.version)

/**
 * Run all pending migrations against a raw runner object and return the
 * migrated result.  This is the synchronous migration core shared between
 * {@link RunnerManager} (which also persists after migration) and
 * {@link yamlToRunnerData} (which only needs the in-memory result).
 *
 * Whether a migration needs to run is decided here, once, by comparing its
 * `version` against `_meta_.version` — individual migrations don't need to
 * (and don't) check this themselves.
 */
export function applyMigrations(runner: object): RunnerData {
  const preMeta = RunnerMetaSchema.parse("_meta_" in runner ? runner._meta_ : {})

  const migrationsToRun = migrationsInOrder.filter((migration) => migration.version > preMeta.version)

  let migrated: MigrationDraft = { ...runner, _meta_: preMeta }

  for (const migration of migrationsToRun) {
    migrated = migration.up(migrated)
  }

  migrated = produce(migrated, (draft) => {
    draft._meta_.version = CURRENT_RUNNER_VERSION

    // Defensive initialization for fields that might be missing in fixtures
    // or skipped migrations.
    draft.spirits ??= []
    draft.spells ??= []
    draft.powers ??= []
    draft.complexForms ??= []
    draft.sprites ??= []
    draft.qualities ??= []
    draft.contacts ??= []
    draft.tradition ??= null
    draft.initiative ??= { passesCompleted: [] }
    draft.gameState ??= { matrix: { knownNodes: [], activePrograms: [] } }
  })

  return migrated as RunnerData
}
