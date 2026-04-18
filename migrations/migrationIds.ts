/**
 * Canonical ordered list of all migration IDs.
 *
 * Import this from `createDefaultCharacterSheet` (or any other synchronous
 * module) to seed `_meta_.appliedMigrations` for new characters without
 * pulling in the top-level-await `migrations/index.ts` module.
 */
export const migrationIds = [
  "20250801",
  "20251001",
  "20260416",
  "20260417",
  "20260418",
  "20260419",
] as const satisfies readonly string[]
