import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import type { AlertInfo } from "#/components/UI/Alerts/alert-info.ts"

export const useQualitiesAlerts = (): AlertInfo[] => {
  const qualities = useCharacterSheet((sheet) => sheet.qualities)

  const statuses: AlertInfo[] = []

  if (qualities.length === 0) {
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
