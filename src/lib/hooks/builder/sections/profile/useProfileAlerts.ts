import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useProfileAlerts = (): AlertInfo[] => {
  const addAlert = (alert: Omit<AlertInfo, "section">) => {
    alerts.push({ section: "Profile", ...alert })
  }

  const alerts: AlertInfo[] = []

  const alias = useRunnerStoreSelector(Selectors.profile.selectProfileAlias)
  if (!alias) {
    addAlert({
      severity: "error",
      title: "Runner alias is required",
      message: "Please enter an alias for your runner",
      summaryOnly: true,
    })
  }

  const name = useRunnerStoreSelector(Selectors.profile.selectProfileName)
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
