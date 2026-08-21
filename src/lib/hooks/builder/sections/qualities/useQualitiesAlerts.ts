import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEditorMode } from "#/lib/contexts/builder/editorMode.tsx"
import { QualitiesSelectors } from "#/lib/stores/runner/qualities/qualitiesSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useQualitiesAlerts = (): AlertInfo[] => {
  const qualities = useRunnerSelector(QualitiesSelectors.selectAll)
  const editorMode = useEditorMode()

  const statuses: AlertInfo[] = []

  if (qualities.length === 0 && editorMode.isBuilder) {
    statuses.push({
      section: "Qualities",
      severity: "warning",
      title: "No qualities selected",
      message: "You haven't selected any qualities. Consider adding positive qualities or balancing with negative ones for extra BP.",
      summaryOnly: true,
    })
  }

  return statuses
}
