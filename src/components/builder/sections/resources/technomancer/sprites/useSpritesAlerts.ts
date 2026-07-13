import { useRunnerData } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

export const useSpritesAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerData((s) => s.biology.awakening)
  const sprites = useRunnerData((s) => s.sprites)

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
