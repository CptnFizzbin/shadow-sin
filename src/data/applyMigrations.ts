import { sort } from "fast-sort"
import { produce } from "immer"
import { z } from "zod"

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

// A raw, not-yet-migrated `_meta_` may be the current shape (partial — a brand new runner has
// neither field yet), or the old sequential-integer scheme's `{ version: number }`. `appVersion`
// is re-declared without `RunnerMetaSchema`'s `.default(...)` — `.partial()` alone still applies
// it for an absent field, which would make `resolveRunnerAppVersion` below unable to tell "no
// appVersion given" from "epoch appVersion given".
const RawRunnerMetaSchema = RunnerMetaSchema.partial().extend({
  appVersion: z.string().optional(),
  version: z.number().optional(),
})

/** The highest `_meta_.version` a runner could carry under the old sequential-integer scheme. */
const LAST_LEGACY_VERSION = 32

/**
 * Resolves the `appVersion` a raw runner's `_meta_` implies, before any migration has run.
 *
 * Runners stamped under the old sequential-integer scheme carry `_meta_.version` instead of
 * `_meta_.appVersion`. A runner already at the last legacy version (32) is the overwhelmingly
 * common case — every runner opened since that version shipped lands there — so it resolves
 * directly to the real timestamp of the migration that stamped it, rather than paying for a full
 * re-run of all 32 legacy migrations. Any other legacy version (rare — a runner that was only
 * ever partially migrated under the old scheme) falls back to the epoch, so every registered
 * migration re-runs against it once; this is safe because every migration is idempotent (see
 * "Character migrations" in AGENTS.md).
 */
function resolveRunnerAppVersion(rawMeta: z.infer<typeof RawRunnerMetaSchema>): string {
  if (typeof rawMeta.appVersion === "string") return rawMeta.appVersion
  if (rawMeta.version === LAST_LEGACY_VERSION) return migrations[LAST_LEGACY_VERSION - 1].timestamp

  return RUNNER_META_EPOCH
}

/** {@link resolveRunnerAppVersion}, starting from a raw (not yet parsed) runner object's `_meta_`. */
export function resolveRawRunnerAppVersion(runner: object): string {
  return resolveRunnerAppVersion(RawRunnerMetaSchema.parse("_meta_" in runner ? runner._meta_ : {}))
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
  const rawMeta = RawRunnerMetaSchema.parse("_meta_" in runner ? runner._meta_ : {})
  const preMeta = RunnerMetaSchema.parse({ ...rawMeta, appVersion: resolveRunnerAppVersion(rawMeta) })

  const migrationsToRun = migrationsInOrder.filter((migration) => isNewer(migration.timestamp, preMeta.appVersion))

  // `addMatrixNode`/`addMatrixGameState` (2026-08-09) aren't idempotent across a full re-run:
  // `addMatrixNode` unconditionally stubs a legacy `matrix` scaffold whenever it's absent, and
  // `addMatrixGameState` then unconditionally treats that stub as real data to convert, replacing
  // `gameState.matrix` with a freshly `crypto.randomUUID()`-tagged node — even for a runner that
  // already has a real `gameState.matrix` and never carried the legacy field. This only bites a
  // runner whose `_meta_.appVersion` is lost or reset (e.g. a hand-edited YAML re-import) after it
  // was already migrated, forcing every migration to run again in one pass. Neither migration can
  // be edited once shipped (see "Character migrations" in AGENTS.md), so the invariant is restored
  // here instead: such a runner has nothing for those two migrations to legitimately do, however
  // many migrations end up running for it.
  const rawGameStateMatrix = "gameState" in runner
    ? (runner as { gameState?: { matrix?: unknown } }).gameState?.matrix
    : undefined
  const preservedGameStateMatrix = rawGameStateMatrix !== null && rawGameStateMatrix !== undefined && !("matrix" in runner)
    ? rawGameStateMatrix
    : undefined

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

    if (preservedGameStateMatrix !== undefined) {
      draft.gameState.matrix = preservedGameStateMatrix
    }
  })

  return migrated as RunnerData
}
