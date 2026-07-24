import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useIsEditMode } from "#/stores/builder/editMode.context.ts"

import { useBuilderBuildPointsApi } from "./useBuildPointsApi.ts"

export const useBuildPointsAlerts = (): AlertInfo[] => {
  const summary = useBuilderBuildPointsApi()
  const isEditMode = useIsEditMode()

  const alerts: AlertInfo[] = []

  if (summary.remaining > BuilderConfig.buildPoints.unspentWarningThreshold && !isEditMode) {
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
