import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useBiologyAlerts = (): AlertInfo[] => {
  const statuses: AlertInfo[] = []

  const metatype = useCharacterSheet((s) => s.biology.metatype)
  if (!metatype) {
    statuses.push({
      section: "Biology",
      severity: "error",
      title: "Metatype not selected",
      message: "Select a metatype to determine starting attributes and BP cost.",
      summaryOnly: true,
    })
  }

  const awakening = useCharacterSheet((s) => s.biology.awakening)
  if (!awakening) {
    statuses.push({
      section: "Biology",
      severity: "error",
      title: "Awakening not selected",
      message: "Select an awakening type if applicable.",
      summaryOnly: true,
    })
  }

  return statuses
}
