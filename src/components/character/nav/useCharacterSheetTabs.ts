import { selectAwakening } from "#/components/character/biology/biologySelectors.ts"
import type { CharacterSection } from "#/components/character/characterSections.ts"
import { characterSectionOrder } from "#/components/character/characterSections.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"

export function useCharacterSheetTabs(): CharacterSection[] {
  const awakening = useCharacterSheet((sheet) => selectAwakening(sheet.biology))

  return characterSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )
}
