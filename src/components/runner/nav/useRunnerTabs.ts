import type { RunnerSection } from "#/components/runner/runnerSections.ts"
import { runnerSectionOrder } from "#/components/runner/runnerSections.ts"
import { selectAwakening } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export function useRunnerTabs(): RunnerSection[] {
  const awakening = useRunnerStoreSelector(selectAwakening)

  return runnerSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )
}
