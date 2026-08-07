import type { AnyCharacterMigration } from "./characterMigration.ts"

export const migrations: AnyCharacterMigration[] = [
  await import("#/data/migrations/20250101_normalizeOldFormatCharacter.ts"),
  await import("#/data/migrations/20250801_addSpellThreshold.ts"),
  await import("#/data/migrations/20251001_addLoanIdAndInterestRate.ts"),
  await import("#/data/migrations/20260416_addVehicleCategory.ts"),
  await import("#/data/migrations/20260417_setDefaultEquippedWeapons.ts"),
  await import("#/data/migrations/20260418_addMeta.ts"),
  await import("#/data/migrations/20260419_removeVersionField.ts"),
  await import("#/data/migrations/20260423_addKarma.ts"),
  await import("#/data/migrations/20260424_addSpiritsArray.ts"),
  await import("#/data/migrations/20260425_addSpiritDamage.ts"),
  await import("#/data/migrations/20260502_splitPainToleranceEffects.ts"),
  await import("#/data/migrations/20260503_nestSpellDrain.ts"),
  await import("#/data/migrations/20260509_renameBookSR20AtoSR4A.ts"),
  await import("#/data/migrations/20260510_renameAdeptPowersToPowers.ts"),
  await import("#/data/migrations/20260511_addMissingWeaponSkill.ts"),
  await import("#/data/migrations/20260517_addFeatureFlags.ts"),
  await import("#/data/migrations/20260521_addKarmaLog.ts"),
  await import("#/data/migrations/20260712_normalizeNullableFields.ts"),
  await import("#/data/migrations/20260716_addMagicAdvancementGrades.ts"),
].map((module) => module.default)

export const migrationIds: readonly string[] = migrations.map((m) => m.id)
