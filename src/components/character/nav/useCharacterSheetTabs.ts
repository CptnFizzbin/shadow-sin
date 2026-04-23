import type { CharacterSection } from "#/components/character/characterSections.ts"
import { characterSectionOrder } from "#/components/character/characterSections.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"

export function useCharacterSheetTabs(): CharacterSection[] {
  const awakening = useCharacterSheet((sheet) => sheet.biology.awakening)

  return characterSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )
}
