import type { SpendKarmaSection } from "#/components/runner/karma/improvements/spendKarmaSections.tsx"
import { SPEND_KARMA_SECTIONS } from "#/components/runner/karma/improvements/spendKarmaSections.tsx"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

/** Sections visible for the current runner, per each section's `visibleFor` gate. */
export const useVisibleSections = (): SpendKarmaSection[] => {
  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)

  return SPEND_KARMA_SECTIONS.filter(
    (section) => !section.visibleFor || section.visibleFor(awakening),
  )
}
