import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectProfileAlerts: Selector<{ runner: RunnerData }, AlertInfo[]> = createMemoizedSelector(
  ProfileSelectors.selectAlias,
  ProfileSelectors.selectName,
  (alias, name): AlertInfo[] => {
    const alerts: AlertInfo[] = []

    if (!alias) {
      alerts.push({
        section: "Profile",
        severity: "error",
        title: "Runner alias is required",
        message: "Please enter an alias for your runner",
        summaryOnly: true,
      })
    }

    if (!name) {
      alerts.push({
        section: "Profile",
        severity: "error",
        title: "Runner name is required",
        message: "Please enter a name for your runner",
        summaryOnly: true,
      })
    }

    return alerts
  },
)
