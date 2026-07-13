import { useRunnerData } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

export const useBiologyAlerts = (): AlertInfo[] => {
  const statuses: AlertInfo[] = []

  const metatype = useRunnerData((s) => s.biology.metatype)
  if (!metatype) {
    statuses.push({
      section: "Biology",
      severity: "error",
      title: "Metatype not selected",
      message: "Select a metatype to determine starting attributes and BP cost.",
      summaryOnly: true,
    })
  }

  const awakening = useRunnerData((s) => s.biology.awakening)
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
