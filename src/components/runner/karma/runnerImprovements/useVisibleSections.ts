import { isMagician } from "#/components/runner/spells/spellsUtils.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import type { SpendKarmaSection } from "./spendKarmaSections.tsx"
import { SPEND_KARMA_SECTIONS } from "./spendKarmaSections.tsx"

/** Sections visible for the current runner (spell section only for magicians). */
export const useVisibleSections = (): SpendKarmaSection[] => {
  const awakening = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const isSpellcaster = isMagician(awakening)

  return SPEND_KARMA_SECTIONS.filter(
    (section) => !section.spellcasterOnly || isSpellcaster,
  )
}
