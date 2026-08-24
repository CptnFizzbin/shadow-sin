import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getSpriteTasksBp } from "#/components/builder/sections/resources/technomancer/sprites/spritesUtils.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { SpriteSelectors } from "#/stores/runner/sprites/spritesSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectSpritesBuildPoints: Selector<{ runner: RunnerData }, BpLineItem> = createMemoizedSelector(
  BiologySelectors.selectAwakening,
  SpriteSelectors.selectVisible,
  (awakeningType, sprites): BpLineItem => {
    const spritesBp = sprites
      .map(getSpriteTasksBp)
      .reduce((total, cost) => total + cost, 0)

    return {
      sectionId: BuilderSectionId.sprites,
      spent: spritesBp,
      enabled: isTechnomancer(awakeningType),
    }
  },
)
