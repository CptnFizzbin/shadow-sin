import { sort } from "fast-sort"

import { compareSemver, CURRENT_FORM_STATE_VERSION } from "#/lib/semver.ts"
import type { CharacterFormState } from "./CharacterFormState.ts"
import { formStateMigrations } from "./migrations/index.ts"

const FORM_STORAGE_KEY_PREFIX = "shadow-sin:character-form:"

function getFormStorageKey(characterId: string): string {
  return `${FORM_STORAGE_KEY_PREFIX}${characterId}`
}

/**
 * Applies any pending migrations to a raw persisted state object, returning
 * a state that conforms to the current CharacterFormState schema.
 */
function migrateState(raw: Record<string, unknown>): CharacterFormState {
  const storedVersion =
    typeof raw["version"] === "string" ? (raw["version"] as string) : "0.0.0"

  let stateData: Record<string, unknown> = { ...raw, version: storedVersion }

  const migrationsToRun = sort(formStateMigrations)
    .asc((migration) => migration.version)
    .filter((migration) => compareSemver(migration.version, storedVersion) > 0)

  for (const migration of migrationsToRun) {
    if (
      compareSemver(
        migration.version,
        (stateData["version"] as string) ?? "0.0.0",
      ) > 0
    ) {
      stateData = migration.up(stateData) as Record<string, unknown>
      stateData["version"] = migration.version
    }
  }

  // Ensure the version reflects the current schema after all migrations.
  stateData["version"] = CURRENT_FORM_STATE_VERSION

  return stateData as unknown as CharacterFormState
}

function loadState(characterId: string): CharacterFormState | undefined {
  const rawValue =
    globalThis.localStorage?.getItem(getFormStorageKey(characterId)) ??
    undefined
  if (!rawValue) return undefined

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>
    return migrateState(parsed)
  } catch {
    return undefined
  }
}

function saveState(characterId: string, state: CharacterFormState): void {
  try {
    globalThis.localStorage?.setItem(
      getFormStorageKey(characterId),
      JSON.stringify(state),
    )
  } catch {
    /* storage unavailable */
  }
}

function clearState(characterId: string): void {
  try {
    globalThis.localStorage?.removeItem(getFormStorageKey(characterId))
  } catch {
    /* storage unavailable */
  }
}

export const FormPersister = {
  loadState,
  saveState,
  clearState,
}
