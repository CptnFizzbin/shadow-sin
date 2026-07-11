import { selectAwakening } from "#/components/runner/biology/biologySelectors.ts"
import type { RunnerSection } from "#/components/runner/runnerSections.ts"
import { runnerSectionOrder } from "#/components/runner/runnerSections.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"

export function useRunnerTabs(): RunnerSection[] {
  const awakening = useRunnerData((sheet) => selectAwakening(sheet.biology))

  return runnerSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )
}
