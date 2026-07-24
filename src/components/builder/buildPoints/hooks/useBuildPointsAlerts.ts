import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEditorMode } from "#/stores/builder/editorMode.tsx"

import { useBuilderBuildPointsApi } from "./useBuildPointsApi.ts"

export const useBuildPointsAlerts = (): AlertInfo[] => {
  const summary = useBuilderBuildPointsApi()
  const editorMode = useEditorMode()

  const alerts: AlertInfo[] = []

  if (summary.remaining > BuilderConfig.buildPoints.unspentWarningThreshold && !editorMode.isEdit) {
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
