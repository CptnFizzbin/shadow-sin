import type { AnyCharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

export const migrations: AnyCharacterMigration[] = [
  await import("./20250601.ts"),
  await import("./20250801.ts"),
  await import("./20251001.ts"),
  await import("./20260416.ts"),
  await import("./20260417.ts"),
].map((module) => module.default)
