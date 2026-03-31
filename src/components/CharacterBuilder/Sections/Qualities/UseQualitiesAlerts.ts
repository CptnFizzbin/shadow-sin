import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

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
