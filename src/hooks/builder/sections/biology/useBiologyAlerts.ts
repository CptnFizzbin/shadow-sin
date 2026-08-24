import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useBiologyAlerts = (): AlertInfo[] => {
  const statuses: AlertInfo[] = []

  const metatype = useRunnerSelector(BiologySelectors.selectMetatype)
  if (!metatype) {
    statuses.push({
      section: "Biology",
      severity: "error",
      title: "Metatype not selected",
      message: "Select a metatype to determine starting attributes and BP cost.",
      summaryOnly: true,
    })
  }

  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
  if (!awakening) {
    statuses.push({
      section: "Biology",
      severity: "error",
      title: "Awakening not selected",
      message: "Select an awakening type if applicable.",
      summaryOnly: true,
    })
  }

  return statuses
}
