import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectBiologyAlerts: Selector<{ runner: RunnerData }, AlertInfo[]> = createMemoizedSelector(
  BiologySelectors.selectMetatype,
  BiologySelectors.selectAwakening,
  (metatype, awakening): AlertInfo[] => {
    const alerts: AlertInfo[] = []

    if (!metatype) {
      alerts.push({
        section: "Biology",
        severity: "error",
        title: "Metatype not selected",
        message: "Select a metatype to determine starting attributes and BP cost.",
        summaryOnly: true,
      })
    }

    if (!awakening) {
      alerts.push({
        section: "Biology",
        severity: "error",
        title: "Awakening not selected",
        message: "Select an awakening type if applicable.",
        summaryOnly: true,
      })
    }

    return alerts
  },
)
