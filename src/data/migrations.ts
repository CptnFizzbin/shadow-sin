import type { AnyCharacterMigration } from "./characterMigration.ts"
import _001_normalizeOldFormatCharacter from "./migrations/001_normalizeOldFormatCharacter.ts"
import _002_addSpellThreshold from "./migrations/002_addSpellThreshold.ts"
import _003_addLoanIdAndInterestRate from "./migrations/003_addLoanIdAndInterestRate.ts"
import _004_addVehicleCategory from "./migrations/004_addVehicleCategory.ts"
import _005_setDefaultEquippedWeapons from "./migrations/005_setDefaultEquippedWeapons.ts"
import _006_addMeta from "./migrations/006_addMeta.ts"
import _007_removeVersionField from "./migrations/007_removeVersionField.ts"
import _008_addKarma from "./migrations/008_addKarma.ts"
import _009_addSpiritsArray from "./migrations/009_addSpiritsArray.ts"
import _010_addSpiritDamage from "./migrations/010_addSpiritDamage.ts"
import _011_splitPainToleranceEffects from "./migrations/011_splitPainToleranceEffects.ts"
import _012_nestSpellDrain from "./migrations/012_nestSpellDrain.ts"
import _013_renameBookSR20AtoSR4A from "./migrations/013_renameBookSR20AtoSR4A.ts"
import _014_renameAdeptPowersToPowers from "./migrations/014_renameAdeptPowersToPowers.ts"
import _015_addMissingWeaponSkill from "./migrations/015_addMissingWeaponSkill.ts"
import _016_addFeatureFlags from "./migrations/016_addFeatureFlags.ts"
import _017_addKarmaLog from "./migrations/017_addKarmaLog.ts"
import _018_normalizeNullableFields from "./migrations/018_normalizeNullableFields.ts"
import _019_addMagicAdvancementGrades from "./migrations/019_addMagicAdvancementGrades.ts"
import _020_addSpriteDamage from "./migrations/020_addSpriteDamage.ts"
import _021_flattenVehicleDamage from "./migrations/021_flattenVehicleDamage.ts"
import _022_pruneLegacyMetaFields from "./migrations/022_pruneLegacyMetaFields.ts"
import _023_addMatrixNode from "./migrations/023_addMatrixNode.ts"
import _024_normalizeArmorRating from "./migrations/024_normalizeArmorRating.ts"
import _025_addMatrixGameState from "./migrations/025_addMatrixGameState.ts"
import _026_addEntityKind from "./migrations/026_addEntityKind.ts"
import _027_moveItems from "./migrations/027_moveItems.ts"
import _028_nestItemAttachment from "./migrations/028_nestItemAttachment.ts"

// Static imports (not `await import(...)`) — a dynamic import here has top-level await, and
// combining that with the "runner-migrations" manualChunks entry below deadlocks Rolldown's
// module graph at runtime (confirmed: the built app hangs completely, no error, nothing ever
// renders). Static imports carry no such await, so the same manualChunks entry can still fold
// every migration into one dedicated chunk safely — see vite.config.ts.
export const migrations: AnyCharacterMigration[] = [
  _001_normalizeOldFormatCharacter,
  _002_addSpellThreshold,
  _003_addLoanIdAndInterestRate,
  _004_addVehicleCategory,
  _005_setDefaultEquippedWeapons,
  _006_addMeta,
  _007_removeVersionField,
  _008_addKarma,
  _009_addSpiritsArray,
  _010_addSpiritDamage,
  _011_splitPainToleranceEffects,
  _012_nestSpellDrain,
  _013_renameBookSR20AtoSR4A,
  _014_renameAdeptPowersToPowers,
  _015_addMissingWeaponSkill,
  _016_addFeatureFlags,
  _017_addKarmaLog,
  _018_normalizeNullableFields,
  _019_addMagicAdvancementGrades,
  _020_addSpriteDamage,
  _021_flattenVehicleDamage,
  _022_pruneLegacyMetaFields,
  _023_addMatrixNode,
  _024_normalizeArmorRating,
  _025_addMatrixGameState,
  _026_addEntityKind,
  _027_moveItems,
  _028_nestItemAttachment,
]

migrations.forEach((migration, index) => {
  if (migration.version !== index + 1) {
    throw new Error(`Invalide version. Expected ${index + 1}, migration was version ${migration.version}`)
  }
})

/** The current RunnerData schema version — the highest migration `version` registered above. */
export const CURRENT_RUNNER_VERSION: number = Math.max(...migrations.map((m) => m.version))
