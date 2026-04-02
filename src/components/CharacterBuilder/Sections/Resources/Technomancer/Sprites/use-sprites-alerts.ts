import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { isTechnomancer } from "#/components/Technomancer/technomancer-utils.ts"
import type { AlertInfo } from "#/components/UI/Alerts/alert-info.ts"

export const useSpritesAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterSheet((s) => s.biology.awakening)
  const sprites = useCharacterSheet((s) => s.sprites)

  const statuses: AlertInfo[] = []

  if (!isTechnomancer(awakeningType)) return statuses

  if (sprites.length === 0) {
    statuses.push({
      section: "Sprites",
      severity: "warning",
      title: "No sprites",
      message: "No sprites added. Add sprites to make use of technomancer sprite abilities.",
      summaryOnly: true,
    })
  }

  return statuses
}
