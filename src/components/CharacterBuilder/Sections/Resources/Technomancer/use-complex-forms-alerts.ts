import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { isTechnomancer } from "#/components/Technomancer/technomancer-utils.ts"
import type { AlertInfo } from "#/components/UI/Alerts/alert-info.ts"

export const useComplexFormsAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterSheet((s) => s.biology.awakening)
  const complexForms = useCharacterSheet((s) => s.complexForms)

  const statuses: AlertInfo[] = []

  if (!isTechnomancer(awakeningType)) return statuses

  if (complexForms.length === 0) {
    statuses.push({
      section: "Complex Forms",
      severity: "warning",
      title: "No complex forms",
      message: "No complex forms added. Add complex forms to enable technomancer abilities that rely on them.",
      summaryOnly: true,
    })
  }

  return statuses
}
