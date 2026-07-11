import { useSelector } from "@tanstack/react-store"

import { selectProfileAlias, selectProfileName } from "#/components/runner/profile/profileSelectors.ts"
import { useProfileStore } from "#/components/runner/profile/useProfileStore.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

export const useProfileAlerts = (): AlertInfo[] => {
  const profileStore = useProfileStore()

  const addAlert = (alert: Omit<AlertInfo, "section">) => {
    alerts.push({ section: "Profile", ...alert })
  }

  const alerts: AlertInfo[] = []

  const alias = useSelector(profileStore, selectProfileAlias)
  if (!alias) {
    addAlert({
      severity: "error",
      title: "Runner alias is required",
      message: "Please enter an alias for your runner",
      summaryOnly: true,
    })
  }

  const name = useSelector(profileStore, selectProfileName)
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
