import type { AnyCharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

export const migrations: AnyCharacterMigration[] = [
  await import("./20250101_normalizeOldFormatCharacter.ts"),
  await import("./20250801_addSpellThreshold.ts"),
  await import("./20251001_addLoanIdAndInterestRate.ts"),
  await import("./20260416_addVehicleCategory.ts"),
  await import("./20260417_setDefaultEquippedWeapons.ts"),
  await import("./20260418_addMeta.ts"),
  await import("./20260419_removeVersionField.ts"),
].map((module) => module.default)

export const migrationIds: readonly string[] = migrations.map((m) => m.id)
