import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useComplexFormsAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerStoreSelector((s) => s.biology.awakening)
  const complexForms = useRunnerStoreSelector((s) => s.complexForms)

  const statuses: AlertInfo[] = []

  if (!isTechnomancer(awakeningType)) return statuses

  if (complexForms.length === 0) {
    statuses.push({
      section: "Complex Forms",
      severity: "warning",
      title: "No complex forms",
      message: "No complex forms added. Add complex forms to enable technomancer abilities that rely on them.",
      summaryOnly: true,
    })
  }

  return statuses
}
