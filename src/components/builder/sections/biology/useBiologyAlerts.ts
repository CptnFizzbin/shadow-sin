import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useBiologyAlerts = (): AlertInfo[] => {
  const statuses: AlertInfo[] = []

  const metatype = useRunnerStoreSelector((s) => s.biology.metatype)
  if (!metatype) {
    statuses.push({
      section: "Biology",
      severity: "error",
      title: "Metatype not selected",
      message: "Select a metatype to determine starting attributes and BP cost.",
      summaryOnly: true,
    })
  }

  const awakening = useRunnerStoreSelector((s) => s.biology.awakening)
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
