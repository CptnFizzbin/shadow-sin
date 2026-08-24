import type { RunnerSection } from "#/components/runner/runnerSections.ts"
import { runnerSectionOrder } from "#/components/runner/runnerSections.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectRunnerTabs: Selector<{ runner: RunnerData }, RunnerSection[]> = createMemoizedSelector(
  BiologySelectors.selectAwakening,
  (awakening) => runnerSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  ),
)
