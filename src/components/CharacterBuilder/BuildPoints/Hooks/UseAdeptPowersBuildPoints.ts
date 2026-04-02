import { isAdept } from "#/components/AdeptPowers/AdeptPowersUtils.ts"
import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"

export const useAdeptPowersBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)

  return {
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
