import type { AnyCharacterMigration } from "./characterMigration.ts"
import v20250101_00_normalizeOldFormatCharacter from "./migrations/20250101_00_normalizeOldFormatCharacter.ts"
import v20250801_00_addSpellThreshold from "./migrations/20250801_00_addSpellThreshold.ts"
import v20251001_00_addLoanIdAndInterestRate from "./migrations/20251001_00_addLoanIdAndInterestRate.ts"
import v20260416_00_addVehicleCategory from "./migrations/20260416_00_addVehicleCategory.ts"
import v20260417_00_setDefaultEquippedWeapons from "./migrations/20260417_00_setDefaultEquippedWeapons.ts"
import v20260418_00_addMeta from "./migrations/20260418_00_addMeta.ts"
import v20260419_00_removeVersionField from "./migrations/20260419_00_removeVersionField.ts"
import v20260423_00_addKarma from "./migrations/20260423_00_addKarma.ts"
import v20260424_00_addSpiritsArray from "./migrations/20260424_00_addSpiritsArray.ts"
import v20260425_00_addSpiritDamage from "./migrations/20260425_00_addSpiritDamage.ts"
import v20260502_00_splitPainToleranceEffects from "./migrations/20260502_00_splitPainToleranceEffects.ts"
import v20260503_00_nestSpellDrain from "./migrations/20260503_00_nestSpellDrain.ts"
import v20260509_00_renameBookSR20AtoSR4A from "./migrations/20260509_00_renameBookSR20AtoSR4A.ts"
import v20260510_00_renameAdeptPowersToPowers from "./migrations/20260510_00_renameAdeptPowersToPowers.ts"
import v20260511_00_addMissingWeaponSkill from "./migrations/20260511_00_addMissingWeaponSkill.ts"
import v20260517_00_addFeatureFlags from "./migrations/20260517_00_addFeatureFlags.ts"
import v20260521_00_addKarmaLog from "./migrations/20260521_00_addKarmaLog.ts"
import v20260712_00_normalizeNullableFields from "./migrations/20260712_00_normalizeNullableFields.ts"
import v20260716_00_addMagicAdvancementGrades from "./migrations/20260716_00_addMagicAdvancementGrades.ts"
import v20260806_00_addSpriteDamage from "./migrations/20260806_00_addSpriteDamage.ts"
import v20260807_00_flattenVehicleDamage from "./migrations/20260807_00_flattenVehicleDamage.ts"
import v20260808_00_pruneLegacyMetaFields from "./migrations/20260808_00_pruneLegacyMetaFields.ts"
import v20260809_00_addMatrixNode from "./migrations/20260809_00_addMatrixNode.ts"
import v20260809_01_normalizeArmorRating from "./migrations/20260809_01_normalizeArmorRating.ts"
import v20260809_02_addMatrixGameState from "./migrations/20260809_02_addMatrixGameState.ts"
import v20260821_00_addEntityKind from "./migrations/20260821_00_addEntityKind.ts"
import v20260823_00_addRunnerName from "./migrations/20260823_00_addRunnerName.ts"
import v20260823_01_moveItems from "./migrations/20260823_01_moveItems.ts"
import v20260823_02_nestItemAttachment from "./migrations/20260823_02_nestItemAttachment.ts"
import v20260823_03_pruneNullUuidChildIds from "./migrations/20260823_03_pruneNullUuidChildIds.ts"
import v20260823_04_addQualityIds from "./migrations/20260823_04_addQualityIds.ts"
import v20260823_05_dropIncompleteQualitySource from "./migrations/20260823_05_dropIncompleteQualitySource.ts"
import v20260827_00_addReputationLedger from "./migrations/20260827_00_addReputationLedger.ts"
import v20260830_00_normalizeSinRating from "./migrations/20260830_00_normalizeSinRating.ts"
import v20260830_01_normalizeLicenseRating from "./migrations/20260830_01_normalizeLicenseRating.ts"
import v20260830_02_normalizeLanguageSkillRating from "./migrations/20260830_02_normalizeLanguageSkillRating.ts"
import v20260907_00_normalizeReputations from "./migrations/20260907_00_normalizeReputations.ts"
import v20260913_00_fixMalformedInnateQualityIds from "./migrations/20260913_00_fixMalformedInnateQualityIds.ts"
import v20260913_01_zeroPixieInnateQualityCost from "./migrations/20260913_01_zeroPixieInnateQualityCost.ts"
import v20260914_00_addExtendedTests from "./migrations/20260914_00_addExtendedTests.ts"

export const migrations: AnyCharacterMigration[] = [
  v20250101_00_normalizeOldFormatCharacter,
  v20250801_00_addSpellThreshold,
  v20251001_00_addLoanIdAndInterestRate,
  v20260416_00_addVehicleCategory,
  v20260417_00_setDefaultEquippedWeapons,
  v20260418_00_addMeta,
  v20260419_00_removeVersionField,
  v20260423_00_addKarma,
  v20260424_00_addSpiritsArray,
  v20260425_00_addSpiritDamage,
  v20260502_00_splitPainToleranceEffects,
  v20260503_00_nestSpellDrain,
  v20260509_00_renameBookSR20AtoSR4A,
  v20260510_00_renameAdeptPowersToPowers,
  v20260511_00_addMissingWeaponSkill,
  v20260517_00_addFeatureFlags,
  v20260521_00_addKarmaLog,
  v20260712_00_normalizeNullableFields,
  v20260716_00_addMagicAdvancementGrades,
  v20260806_00_addSpriteDamage,
  v20260807_00_flattenVehicleDamage,
  v20260808_00_pruneLegacyMetaFields,
  v20260809_00_addMatrixNode,
  v20260809_01_normalizeArmorRating,
  v20260809_02_addMatrixGameState,
  v20260821_00_addEntityKind,
  v20260823_00_addRunnerName,
  v20260823_01_moveItems,
  v20260823_02_nestItemAttachment,
  v20260823_03_pruneNullUuidChildIds,
  v20260823_04_addQualityIds,
  v20260823_05_dropIncompleteQualitySource,
  v20260827_00_addReputationLedger,
  v20260830_00_normalizeSinRating,
  v20260830_01_normalizeLicenseRating,
  v20260830_02_normalizeLanguageSkillRating,
  v20260907_00_normalizeReputations,
  v20260913_00_fixMalformedInnateQualityIds,
  v20260913_01_zeroPixieInnateQualityCost,
  v20260914_00_addExtendedTests,
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

export const LATEST_MIGRATION_TIMESTAMP: string = migrations[migrations.length - 1].timestamp

export function isFullyMigrated(sinVersion: string): boolean {
  return new Date(sinVersion).getTime() >= new Date(LATEST_MIGRATION_TIMESTAMP).getTime()
}
