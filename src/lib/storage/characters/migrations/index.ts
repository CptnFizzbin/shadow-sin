import type { AnyCharacterMigration } from "#/lib/storage/characters/CharacterMigration.ts"

export const migrations: AnyCharacterMigration[] = [
  await import("./v0_1_0.ts"),
  await import("./v0_2_0.ts"),
].map((module) => module.default)
