import type { RunnerSection } from "#/components/runner/runnerSections.ts"
import { runnerSectionOrder } from "#/components/runner/runnerSections.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export function useRunnerTabs(): RunnerSection[] {
  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)

  return runnerSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )
}
