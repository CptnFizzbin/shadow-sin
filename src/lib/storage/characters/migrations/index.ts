import type { AnyCharacterMigration } from "#/lib/storage/characters/character-migration.ts"

export const migrations: AnyCharacterMigration[] = [
  await import("./v0-1-0.ts"),
  await import("./v0-2-0.ts"),
].map((module) => module.default)
