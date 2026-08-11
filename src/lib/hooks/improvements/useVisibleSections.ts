import type { SpendKarmaSection } from "#/components/improvements/spendKarmaSections.tsx"
import { SPEND_KARMA_SECTIONS } from "#/components/improvements/spendKarmaSections.tsx"
import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"

/** Sections visible for the current runner, per each section's `visibleFor` gate. */
export const useVisibleSections = (): SpendKarmaSection[] => {
  const awakening = useRunnerSelector(({ biology }) => biology.awakening)

  return SPEND_KARMA_SECTIONS.filter(
    (section) => !section.visibleFor || section.visibleFor(awakening),
  )
}
