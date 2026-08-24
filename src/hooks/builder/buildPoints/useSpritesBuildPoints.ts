import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getSpriteTasksBp } from "#/components/builder/sections/resources/technomancer/sprites/spritesUtils.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SpriteSelectors } from "#/stores/runner/sprites/spritesSlice.selectors.ts"

export const useSpritesBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const sprites = useRunnerSelector(SpriteSelectors.selectVisible)

  const spritesBp = sprites
    .map(getSpriteTasksBp)
    .reduce((total, cost) => total + cost, 0)

  return {
    sectionId: BuilderSectionId.sprites,
    spent: spritesBp,
    enabled: isTechnomancer(awakeningType),
  }
}
