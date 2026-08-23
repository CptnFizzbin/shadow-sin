import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { ProfileSelectors } from "#/lib/stores/runner/profile/profileSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useProfileAlerts = (): AlertInfo[] => {
  const addAlert = (alert: Omit<AlertInfo, "section">) => {
    alerts.push({ section: "Profile", ...alert })
  }

  const alerts: AlertInfo[] = []

  const alias = useRunnerSelector(ProfileSelectors.selectAlias)
  if (!alias) {
    addAlert({
      severity: "error",
      title: "Runner alias is required",
      message: "Please enter an alias for your runner",
      summaryOnly: true,
    })
  }

  const name = useRunnerSelector(ProfileSelectors.selectName)
  if (!name) {
    addAlert({
      severity: "error",
      title: "Runner name is required",
      message: "Please enter a name for your runner",
      summaryOnly: true,
    })
  }

  return alerts
}
