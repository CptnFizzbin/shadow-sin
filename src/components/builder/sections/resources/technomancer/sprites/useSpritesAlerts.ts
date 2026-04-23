import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { isTechnomancer } from "#/components/character/technomancer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

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
