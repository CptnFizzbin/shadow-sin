import { useBuilderBuildPointsApi } from "#/components/CharacterBuilder/BuildPoints/Hooks/useBuildPointsApi.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useBuildPointsAlerts = (): AlertInfo[] => {
  const summary = useBuilderBuildPointsApi()

  const alerts: AlertInfo[] = []

  if (summary.remaining > 5) {
    alerts.push({
      section: "Build Points",
      severity: "warning",
      title: "Unspent Build Points",
      message: `You have ${summary.remaining} unspent build points. Consider buying additional gear or improving skills/qualities.`,
      summaryOnly: true,
    })
  }

  return alerts
}
