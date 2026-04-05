import { isAdept } from "#/components/adeptPowers/adeptPowersUtils.ts"
import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import type { BpLineItem } from "#/components/characterBuilder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"

export const useAdeptPowersBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)

  return {
    sectionId: BuilderSectionId.adeptPowers,
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
