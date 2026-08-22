import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { SpriteSelectors } from "#/lib/stores/runner/sprites/spritesSlice.selectors.ts"

export const useSpritesAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const sprites = useRunnerSelector(SpriteSelectors.selectAll)

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
