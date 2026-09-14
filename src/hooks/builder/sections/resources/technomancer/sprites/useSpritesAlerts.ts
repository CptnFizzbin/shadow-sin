import { isTechnomancer } from "#/components/runner/awakenings/technomancer/viewer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpriteSelectors } from "#/state/runner/sprites/sprites.selector.ts"

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
