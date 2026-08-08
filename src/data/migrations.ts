import type { AnyCharacterMigration } from "./characterMigration.ts"

// Dynamic imports — Vite/Rollup would normally code-split each of these into its own lazy chunk,
// but the `manualChunks` config in vite.config.ts folds everything under `src/data/migrations/`
// (this file included) into a single "runner-migrations" chunk instead, since they always need
// to load and run together.
export const migrations: AnyCharacterMigration[] = [
  await import("#/data/migrations/001_normalizeOldFormatCharacter.ts"),
  await import("#/data/migrations/002_addSpellThreshold.ts"),
  await import("#/data/migrations/003_addLoanIdAndInterestRate.ts"),
  await import("#/data/migrations/004_addVehicleCategory.ts"),
  await import("#/data/migrations/005_setDefaultEquippedWeapons.ts"),
  await import("#/data/migrations/006_addMeta.ts"),
  await import("#/data/migrations/007_removeVersionField.ts"),
  await import("#/data/migrations/008_addKarma.ts"),
  await import("#/data/migrations/009_addSpiritsArray.ts"),
  await import("#/data/migrations/010_addSpiritDamage.ts"),
  await import("#/data/migrations/011_splitPainToleranceEffects.ts"),
  await import("#/data/migrations/012_nestSpellDrain.ts"),
  await import("#/data/migrations/013_renameBookSR20AtoSR4A.ts"),
  await import("#/data/migrations/014_renameAdeptPowersToPowers.ts"),
  await import("#/data/migrations/015_addMissingWeaponSkill.ts"),
  await import("#/data/migrations/016_addFeatureFlags.ts"),
  await import("#/data/migrations/017_addKarmaLog.ts"),
  await import("#/data/migrations/018_normalizeNullableFields.ts"),
  await import("#/data/migrations/019_addMagicAdvancementGrades.ts"),
  await import("#/data/migrations/020_addSpriteDamage.ts"),
  await import("#/data/migrations/021_flattenVehicleDamage.ts"),
].map((module) => module.default)

/** The current RunnerData schema version — the highest migration `version` registered above. */
export const CURRENT_RUNNER_VERSION: number = Math.max(...migrations.map((m) => m.version))
