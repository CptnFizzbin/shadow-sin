import type { SpendKarmaSection } from "#/components/improvements/spendKarmaSections.tsx"
import { SPEND_KARMA_SECTIONS } from "#/components/improvements/spendKarmaSections.tsx"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

/** Sections visible for the current runner, per each section's `visibleFor` gate. */
export const useVisibleSections = (): SpendKarmaSection[] => {
  const awakening = useRunnerStoreSelector((sheet) => sheet.biology.awakening)

  return SPEND_KARMA_SECTIONS.filter(
    (section) => !section.visibleFor || section.visibleFor(awakening),
  )
}
