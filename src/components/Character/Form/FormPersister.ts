import { sort } from "fast-sort"

import type { BuilderState } from "#/components/CharacterBuilder/BuilderState.ts"
import { compareSemver, CURRENT_FORM_STATE_VERSION } from "#/lib/semver.ts"
import { formStateMigrations } from "./migrations/index.ts"

const FORM_STORAGE_KEY_PREFIX = "shadow-sin:character-form:"

function getFormStorageKey(characterId: string): string {
  return `${FORM_STORAGE_KEY_PREFIX}${characterId}`
}

/**
 * Applies any pending migrations to a raw persisted builder state object,
 * returning a state that conforms to the current BuilderState schema.
 */
function migrateState(raw: Record<string, unknown>): BuilderState {
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

  stateData["version"] = CURRENT_FORM_STATE_VERSION

  return stateData as unknown as BuilderState
}

function isBuilderState(raw: Record<string, unknown>): boolean {
  // Old CharacterFormState used "characterId" but had no "buildPoints".
  // New BuilderState has both. Discard old-format saves gracefully.
  const buildPoints = raw["buildPoints"]
  return (
    typeof raw["characterId"] === "string" &&
    typeof buildPoints === "object" &&
    buildPoints !== null &&
    "total" in buildPoints &&
    "spent" in buildPoints
  )
}

function loadState(characterId: string): BuilderState | undefined {
  const rawValue =
    globalThis.localStorage?.getItem(getFormStorageKey(characterId)) ??
    undefined
  if (!rawValue) return undefined

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>
    if (!isBuilderState(parsed)) return undefined
    return migrateState(parsed)
  } catch {
    return undefined
  }
}

function saveState(characterId: string, state: BuilderState): void {
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
