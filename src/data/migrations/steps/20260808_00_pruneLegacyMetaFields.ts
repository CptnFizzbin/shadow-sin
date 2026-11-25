import type { CharacterMigration } from "#/data/characterMigration.ts"

/**
 * No-op transform on the character data itself. `_meta_.appliedMigrations` — the old
 * per-migration-id tracking array, replaced by the single `_meta_.version` counter — is already
 * stripped in memory by `RunnerMetaSchema` before any migration runs (see `applyMigrations`), so
 * there's nothing left for `up` to delete here.
 *
 * This migration exists purely to bump `_meta_.version` past whatever a runner was stamped at
 * under the old system, so `RunnerManager.getRunner` resaves it and the stale
 * `appliedMigrations` key is dropped from storage for good, instead of lingering indefinitely on
 * runners that never trigger another resave.
 */
const migration: CharacterMigration = {
  timestamp: "2026-08-08T03:03:07Z",
  up: (character) => character,
}

export default migration
