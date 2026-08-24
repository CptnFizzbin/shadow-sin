import type { AnyCharacterMigration } from "./characterMigration.ts"
import normalizeOldFormatCharacter from "./migrations/20250101_00_normalizeOldFormatCharacter.ts"
import addSpellThreshold from "./migrations/20250801_00_addSpellThreshold.ts"
import addLoanIdAndInterestRate from "./migrations/20251001_00_addLoanIdAndInterestRate.ts"
import addVehicleCategory from "./migrations/20260416_00_addVehicleCategory.ts"
import setDefaultEquippedWeapons from "./migrations/20260417_00_setDefaultEquippedWeapons.ts"
import addMeta from "./migrations/20260418_00_addMeta.ts"
import removeVersionField from "./migrations/20260419_00_removeVersionField.ts"
import addKarma from "./migrations/20260423_00_addKarma.ts"
import addSpiritsArray from "./migrations/20260424_00_addSpiritsArray.ts"
import addSpiritDamage from "./migrations/20260425_00_addSpiritDamage.ts"
import splitPainToleranceEffects from "./migrations/20260502_00_splitPainToleranceEffects.ts"
import nestSpellDrain from "./migrations/20260503_00_nestSpellDrain.ts"
import renameBookSR20AtoSR4A from "./migrations/20260509_00_renameBookSR20AtoSR4A.ts"
import renameAdeptPowersToPowers from "./migrations/20260510_00_renameAdeptPowersToPowers.ts"
import addMissingWeaponSkill from "./migrations/20260511_00_addMissingWeaponSkill.ts"
import addFeatureFlags from "./migrations/20260517_00_addFeatureFlags.ts"
import addKarmaLog from "./migrations/20260521_00_addKarmaLog.ts"
import normalizeNullableFields from "./migrations/20260712_00_normalizeNullableFields.ts"
import addMagicAdvancementGrades from "./migrations/20260716_00_addMagicAdvancementGrades.ts"
import addSpriteDamage from "./migrations/20260806_00_addSpriteDamage.ts"
import flattenVehicleDamage from "./migrations/20260807_00_flattenVehicleDamage.ts"
import pruneLegacyMetaFields from "./migrations/20260808_00_pruneLegacyMetaFields.ts"
import addMatrixNode from "./migrations/20260809_00_addMatrixNode.ts"
import normalizeArmorRating from "./migrations/20260809_01_normalizeArmorRating.ts"
import addMatrixGameState from "./migrations/20260809_02_addMatrixGameState.ts"
import addEntityKind from "./migrations/20260821_00_addEntityKind.ts"
import addRunnerName from "./migrations/20260823_00_addRunnerName.ts"
import moveItems from "./migrations/20260823_01_moveItems.ts"
import nestItemAttachment from "./migrations/20260823_02_nestItemAttachment.ts"
import pruneNullUuidChildIds from "./migrations/20260823_03_pruneNullUuidChildIds.ts"
import addQualityIds from "./migrations/20260823_04_addQualityIds.ts"
import dropIncompleteQualitySource from "./migrations/20260823_05_dropIncompleteQualitySource.ts"

// Static imports (not `await import(...)`) — a dynamic import here has top-level await, and
// combining that with the "runner-migrations" manualChunks entry below deadlocks Rolldown's
// module graph at runtime (confirmed: the built app hangs completely, no error, nothing ever
// renders). Static imports carry no such await, so the same manualChunks entry can still fold
// every migration into one dedicated chunk safely — see vite.config.ts.
//
// Declaration order here must match ascending `timestamp` order — enforced below.
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
  addMatrixNode,
  normalizeArmorRating,
  addMatrixGameState,
  addEntityKind,
  addRunnerName,
  moveItems,
  nestItemAttachment,
  pruneNullUuidChildIds,
  addQualityIds,
  dropIncompleteQualitySource,
]

migrations.forEach((migration, index) => {
  const previous = migrations[index - 1]
  if (previous && new Date(migration.timestamp).getTime() <= new Date(previous.timestamp).getTime()) {
    throw new Error(
      `Invalid migration order: "${previous.timestamp}" must be strictly before "${migration.timestamp}" `
      + `(declaration order must match ascending timestamp order).`,
    )
  }
})

/** The most recent `timestamp` among all registered migrations. */
export const LATEST_MIGRATION_TIMESTAMP: string = migrations[migrations.length - 1].timestamp

/** Whether every registered migration's `timestamp` is at or before `appVersion` — i.e. nothing is left pending. */
export function isFullyMigrated(appVersion: string): boolean {
  return new Date(appVersion).getTime() >= new Date(LATEST_MIGRATION_TIMESTAMP).getTime()
}
