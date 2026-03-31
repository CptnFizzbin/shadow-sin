import { isAdept } from "#/components/AdeptPowers/AdeptPowersUtils.ts"
import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"

export const useAdeptPowersBuildPoints = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)

  return {
    label: "Adept Powers",
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
