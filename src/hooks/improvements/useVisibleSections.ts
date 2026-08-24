import type { SpendKarmaSection } from "#/components/improvements/spendKarmaSections.tsx"
import { SPEND_KARMA_SECTIONS } from "#/components/improvements/spendKarmaSections.tsx"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** Sections visible for the current runner, per each section's `visibleFor` gate. */
export const selectVisibleSections: Selector<{ runner: RunnerData }, SpendKarmaSection[]> = createMemoizedSelector(
  BiologySelectors.selectAwakening,
  (awakening) => SPEND_KARMA_SECTIONS.filter(
    (section) => !section.visibleFor || section.visibleFor(awakening),
  ),
)
