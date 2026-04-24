import type { AnyCharacterMigration } from "#/character/characterMigration.ts"

export const migrations: AnyCharacterMigration[] = [
  await import("./migrations/20250101_normalizeOldFormatCharacter.ts"),
  await import("./migrations/20250801_addSpellThreshold.ts"),
  await import("./migrations/20251001_addLoanIdAndInterestRate.ts"),
  await import("./migrations/20260416_addVehicleCategory.ts"),
  await import("./migrations/20260417_setDefaultEquippedWeapons.ts"),
  await import("./migrations/20260418_addMeta.ts"),
  await import("./migrations/20260419_removeVersionField.ts"),
  await import("./migrations/20260423_addKarma.ts"),
].map((module) => module.default)

export const migrationIds: readonly string[] = migrations.map((m) => m.id)
