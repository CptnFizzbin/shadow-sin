import type { AnyCharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

export const migrations: AnyCharacterMigration[] = [
  await import("./v010.ts"),
  await import("./v020.ts"),
  await import("./v030.ts"),
].map((module) => module.default)
