import { sort } from "fast-sort"
import { produce } from "immer"

import type { RunnerData } from "#/system/runnerData.ts"
import { RUNNER_META_EPOCH, RunnerMetaSchema } from "#/system/runnerData.ts"

import { APP_VERSION } from "./appVersion.ts"
import { migrations } from "./migrations.ts"

interface MigrationDraft {
  _meta_: {
    appVersion: string
  }
  // `any` rather than `unknown` so the final single `as RunnerData` cast below is structurally
  // valid — migrations are expected to produce a fully valid RunnerData, but the type system
  // can't verify that.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const migrationsInOrder = sort(migrations).asc((migration) => new Date(migration.timestamp).getTime())

const isNewer = (a: string, b: string): boolean => new Date(a).getTime() > new Date(b).getTime()

/**
 * Resolves the `appVersion` a raw runner's `_meta_` implies, before any migration has run.
 *
 * Runners stamped under the old sequential-integer scheme carry `_meta_.version` — the highest
 * migration index applied — instead of `_meta_.appVersion`. That index is translated into the
 * equivalent timestamp by indexing into `migrations`' declaration order, which is guaranteed
 * chronological by the ordering check in `migrations.ts`.
 */
export function resolveRunnerAppVersion(runner: object): string {
  const rawMeta = "_meta_" in runner ? runner._meta_ : undefined
  if (typeof rawMeta !== "object" || rawMeta === null) return RUNNER_META_EPOCH

  const meta = rawMeta as Record<string, unknown>
  if (typeof meta.appVersion === "string") return meta.appVersion
  if (typeof meta.version === "number") return migrations[meta.version - 1]?.timestamp ?? RUNNER_META_EPOCH

  return RUNNER_META_EPOCH
}

/**
 * Run all pending migrations against a raw runner object and return the
 * migrated result.  This is the synchronous migration core shared between
 * {@link RunnerManager} (which also persists after migration) and
 * {@link yamlToRunnerData} (which only needs the in-memory result).
 *
 * Whether a migration needs to run is decided here, once, by comparing its
 * `timestamp` against `_meta_.appVersion` — individual migrations don't need
 * to (and don't) check this themselves.
 */
export function applyMigrations(runner: object): RunnerData {
  const rawMeta = "_meta_" in runner && typeof runner._meta_ === "object" && runner._meta_ !== null
    ? runner._meta_
    : {}
  const preMeta = RunnerMetaSchema.parse({ ...rawMeta, appVersion: resolveRunnerAppVersion(runner) })

  const migrationsToRun = migrationsInOrder.filter((migration) => isNewer(migration.timestamp, preMeta.appVersion))

  let migrated: MigrationDraft = { ...runner, _meta_: preMeta }

  for (const migration of migrationsToRun) {
    migrated = migration.up(migrated)
  }

  migrated = produce(migrated, (draft) => {
    // Only stamp the live app version when a migration actually ran — otherwise a runner that's
    // already fully migrated would get bumped to "now" on every load (e.g. after a redeploy or a
    // dev server restart) even though nothing about its data changed.
    if (migrationsToRun.length > 0) {
      draft._meta_.appVersion = APP_VERSION
    }

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
    draft.items ??= { parentId: null, childIds: [] }
    draft.initiative ??= { passesCompleted: [] }
    draft.gameState ??= { matrix: { knownNodes: [], activePrograms: [] } }
  })

  return migrated as RunnerData
}
