import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"

export function useBuilderAwakeningType() {
  return useCharacterSheet((sheet) => sheet.biology.awakening)
}
