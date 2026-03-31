import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { isTechnomancer } from "#/components/Technomancer/TechnomancerUtils.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useTechnomancerAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterSheet((s) => s.biology.awakening)
  const complexForms = useCharacterSheet((s) => s.complexForms)
  const sprites = useCharacterSheet((s) => s.sprites)

  const statuses: AlertInfo[] = []

  if (!isTechnomancer(awakeningType)) return statuses

  if (complexForms.length === 0 && sprites.length === 0) {
    statuses.push({
      section: "Technomancer",
      severity: "warning",
      title: "No technomancer resources",
      message: "No complex forms or sprites added. Consider adding to make use of technomancer abilities.",
      summaryOnly: true,
    })
  }

  return statuses
}
