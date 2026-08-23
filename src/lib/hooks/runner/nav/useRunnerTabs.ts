import type { RunnerSection } from "#/components/runner/runnerSections.ts"
import { runnerSectionOrder } from "#/components/runner/runnerSections.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export function useRunnerTabs(): RunnerSection[] {
  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)

  return runnerSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )
}
