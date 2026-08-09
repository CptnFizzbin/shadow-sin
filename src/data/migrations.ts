import type { AnyCharacterMigration } from "./characterMigration.ts"
import normalizeOldFormatCharacter from "./migrations/001_normalizeOldFormatCharacter.ts"
import addSpellThreshold from "./migrations/002_addSpellThreshold.ts"
import addLoanIdAndInterestRate from "./migrations/003_addLoanIdAndInterestRate.ts"
import addVehicleCategory from "./migrations/004_addVehicleCategory.ts"
import setDefaultEquippedWeapons from "./migrations/005_setDefaultEquippedWeapons.ts"
import addMeta from "./migrations/006_addMeta.ts"
import removeVersionField from "./migrations/007_removeVersionField.ts"
import addKarma from "./migrations/008_addKarma.ts"
import addSpiritsArray from "./migrations/009_addSpiritsArray.ts"
import addSpiritDamage from "./migrations/010_addSpiritDamage.ts"
import splitPainToleranceEffects from "./migrations/011_splitPainToleranceEffects.ts"
import nestSpellDrain from "./migrations/012_nestSpellDrain.ts"
import renameBookSR20AtoSR4A from "./migrations/013_renameBookSR20AtoSR4A.ts"
import renameAdeptPowersToPowers from "./migrations/014_renameAdeptPowersToPowers.ts"
import addMissingWeaponSkill from "./migrations/015_addMissingWeaponSkill.ts"
import addFeatureFlags from "./migrations/016_addFeatureFlags.ts"
import addKarmaLog from "./migrations/017_addKarmaLog.ts"
import normalizeNullableFields from "./migrations/018_normalizeNullableFields.ts"
import addMagicAdvancementGrades from "./migrations/019_addMagicAdvancementGrades.ts"
import addSpriteDamage from "./migrations/020_addSpriteDamage.ts"
import flattenVehicleDamage from "./migrations/021_flattenVehicleDamage.ts"
import pruneLegacyMetaFields from "./migrations/022_pruneLegacyMetaFields.ts"
import normalizeArmorRating from "./migrations/023_normalizeArmorRating.ts"

// Static imports (not `await import(...)`) — a dynamic import here has top-level await, and
// combining that with the "runner-migrations" manualChunks entry below deadlocks Rolldown's
// module graph at runtime (confirmed: the built app hangs completely, no error, nothing ever
// renders). Static imports carry no such await, so the same manualChunks entry can still fold
// every migration into one dedicated chunk safely — see vite.config.ts.
export const migrations: AnyCharacterMigration[] = [
  normalizeOldFormatCharacter,
  addSpellThreshold,
  addLoanIdAndInterestRate,
  addVehicleCategory,
  setDefaultEquippedWeapons,
  addMeta,
  removeVersionField,
  addKarma,
  addSpiritsArray,
  addSpiritDamage,
  splitPainToleranceEffects,
  nestSpellDrain,
  renameBookSR20AtoSR4A,
  renameAdeptPowersToPowers,
  addMissingWeaponSkill,
  addFeatureFlags,
  addKarmaLog,
  normalizeNullableFields,
  addMagicAdvancementGrades,
  addSpriteDamage,
  flattenVehicleDamage,
  pruneLegacyMetaFields,
  normalizeArmorRating,
]

/** The current RunnerData schema version — the highest migration `version` registered above. */
export const CURRENT_RUNNER_VERSION: number = Math.max(...migrations.map((m) => m.version))
