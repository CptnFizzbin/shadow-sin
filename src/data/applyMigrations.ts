import { sort } from "fast-sort"
import { produce } from "immer"
import { z } from "zod"

import type { RunnerData } from "#/system/runnerData.ts"
import { RUNNER_META_EPOCH, RunnerMetaSchema } from "#/system/runnerData.ts"

import { APP_VERSION } from "./appVersion.ts"
import { migrations } from "./migrations.ts"

interface MigrationDraft {
  _meta_: {
    sinVersion: string
    appVersion: string | null
  }
  // `any` rather than `unknown` so the final single `as RunnerData` cast below is structurally
  // valid — migrations are expected to produce a fully valid RunnerData, but the type system
  // can't verify that.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const migrationsInOrder = sort(migrations).asc((migration) => new Date(migration.timestamp).getTime())

const isNewer = (a: string, b: string): boolean => new Date(a).getTime() > new Date(b).getTime()

// A raw, not-yet-migrated `_meta_` may be the current shape (partial — a brand new runner has
// neither field yet), the pre-split shape where `appVersion` doubled as the migration-tracking
// value (see `resolveRunnerSinVersion` below), or the old sequential-integer scheme's
// `{ version: number }`. `sinVersion` is re-declared without `RunnerMetaSchema`'s `.default(...)`
// — `.partial()` alone still applies it for an absent field, which would make
// `resolveRunnerSinVersion` below unable to tell "no sinVersion given" from "epoch sinVersion
// given".
const RawRunnerMetaSchema = RunnerMetaSchema.partial().extend({
  sinVersion: z.string().optional(),
  version: z.number().optional(),
})

/** The highest `_meta_.version` a runner could carry under the old sequential-integer scheme. */
const LAST_LEGACY_VERSION = 32

/**
 * Resolves the `sinVersion` a raw runner's `_meta_` implies, before any migration has run.
 *
 * Runners saved before `_meta_.appVersion` was split into `sinVersion` and `appVersion` carry
 * their migration-tracking value under the old `appVersion` name — that value means exactly what
 * `sinVersion` means now, so it's read as a fallback. Runners stamped under the older still
 * sequential-integer scheme carry `_meta_.version` instead. A runner already at the last legacy
 * version (32) is the overwhelmingly common case — every runner opened since that version shipped
 * lands there — so it resolves directly to the real timestamp of the migration that stamped it,
 * rather than paying for a full re-run of all 32 legacy migrations. Any other legacy version
 * (rare — a runner that was only ever partially migrated under the old scheme) falls back to the
 * epoch, so every registered migration re-runs against it once; this is safe because every
 * migration is idempotent (see "Character migrations" in AGENTS.md).
 */
function resolveRunnerSinVersion(rawMeta: z.infer<typeof RawRunnerMetaSchema>): string {
  if (typeof rawMeta.sinVersion === "string") return rawMeta.sinVersion
  if (typeof rawMeta.appVersion === "string") return rawMeta.appVersion
  if (rawMeta.version === LAST_LEGACY_VERSION) return migrations[LAST_LEGACY_VERSION - 1].timestamp

  return RUNNER_META_EPOCH
}

/** {@link resolveRunnerSinVersion}, starting from a raw (not yet parsed) runner object's `_meta_`. */
export function resolveRawRunnerSinVersion(runner: object): string {
  return resolveRunnerSinVersion(RawRunnerMetaSchema.parse("_meta_" in runner ? runner._meta_ : {}))
}

/**
 * Run all pending migrations against a raw runner object and return the
 * migrated result.  This is the synchronous migration core shared between
 * {@link RunnerManager} (which also persists after migration) and
 * {@link yamlToRunnerData} (which only needs the in-memory result).
 *
 * Whether a migration needs to run is decided here, once, by comparing its
 * `timestamp` against `_meta_.sinVersion` — individual migrations don't need
 * to (and don't) check this themselves.
 */
export function applyMigrations(runner: object): RunnerData {
  const rawMeta = RawRunnerMetaSchema.parse("_meta_" in runner ? runner._meta_ : {})
  const preMeta = RunnerMetaSchema.parse({ ...rawMeta, sinVersion: resolveRunnerSinVersion(rawMeta) })

  const migrationsToRun = migrationsInOrder.filter((migration) => isNewer(migration.timestamp, preMeta.sinVersion))

  let migrated: MigrationDraft = { ...runner, _meta_: preMeta }

  for (const migration of migrationsToRun) {
    migrated = migration.up(migrated)
  }

  migrated = produce(migrated, (draft) => {
    // Only stamp when a migration actually ran — otherwise a runner that's already fully migrated
    // would get bumped on every load (e.g. after a redeploy or a dev server restart) even though
    // nothing about its data changed.
    if (migrationsToRun.length > 0) {
      // migrationsToRun is a suffix of migrationsInOrder (everything newer than preMeta.sinVersion),
      // so its last entry is always the most recently registered migration — i.e. the last one that
      // actually ran.
      draft._meta_.sinVersion = migrationsToRun[migrationsToRun.length - 1].timestamp
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
