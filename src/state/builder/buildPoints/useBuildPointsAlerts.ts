import type { AlertInfo } from "#/common/alerts/alertInfo.ts"
import { BuilderConfig } from "#/rules/buildPoints/builderConfig.ts"
import { useEditorMode } from "#/state/editor/editorMode.tsx"

import { useBuilderBuildPointsApi } from "./useBuildPointsApi.ts"

export const useBuildPointsAlerts = (): AlertInfo[] => {
  const summary = useBuilderBuildPointsApi()
  const editorMode = useEditorMode()

  const alerts: AlertInfo[] = []

  if (summary.remaining > BuilderConfig.buildPoints.unspentWarningThreshold && editorMode.isBuilder) {
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
