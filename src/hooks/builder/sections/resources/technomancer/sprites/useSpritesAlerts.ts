import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { SpriteSelectors } from "#/stores/runner/sprites/spritesSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectSpritesAlerts: Selector<{ runner: RunnerData }, AlertInfo[]> = createMemoizedSelector(
  BiologySelectors.selectAwakening,
  SpriteSelectors.selectAll,
  (awakeningType, sprites): AlertInfo[] => {
    if (!isTechnomancer(awakeningType)) return []

    if (sprites.length === 0) {
      return [{
        section: "Sprites",
        severity: "warning",
        title: "No sprites",
        message: "No sprites added. Add sprites to make use of technomancer sprite abilities.",
        summaryOnly: true,
      }]
    }

    return []
  },
)
