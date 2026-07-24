import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useIsEditMode } from "#/stores/builder/editMode.context.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useQualitiesAlerts = (): AlertInfo[] => {
  const qualities = useRunnerStoreSelector((sheet) => sheet.qualities)
  const isEditMode = useIsEditMode()

  const statuses: AlertInfo[] = []

  if (qualities.length === 0 && !isEditMode) {
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
