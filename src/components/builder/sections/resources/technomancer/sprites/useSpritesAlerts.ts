import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useSpritesAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerStoreSelector((s) => s.biology.awakening)
  const sprites = useRunnerStoreSelector((s) => s.sprites)

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
