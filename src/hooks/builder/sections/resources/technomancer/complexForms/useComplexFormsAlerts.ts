import { isTechnomancer } from "#/components/technomancer/viewer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { ComplexFormsSelectors } from "#/state/runner/complexForms/complexForms.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export const useComplexFormsAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const complexForms = useRunnerSelector(ComplexFormsSelectors.selectAll)

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
