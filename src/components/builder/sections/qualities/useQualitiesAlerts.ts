import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEditorMode } from "#/stores/builder/editorMode.tsx"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useQualitiesAlerts = (): AlertInfo[] => {
  const qualities = useRunnerStoreSelector((sheet) => sheet.qualities)
  const { isEdit } = useEditorMode()

  const statuses: AlertInfo[] = []

  if (qualities.length === 0 && !isEdit) {
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
