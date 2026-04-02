import { isAdept } from "#/components/AdeptPowers/adept-powers-utils.ts"
import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/bp-line-item.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"

export const useAdeptPowersBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)

  return {
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
