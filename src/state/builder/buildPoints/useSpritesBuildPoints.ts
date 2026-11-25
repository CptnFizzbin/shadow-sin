import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { getSpriteTasksBp } from "#/components/runner/awakenings/technomancer/builder/sprites/spritesUtils.ts"
import { isTechnomancer } from "#/components/runner/awakenings/technomancer/viewer/technomancerUtils.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpriteSelectors } from "#/state/runner/sprites/sprites.selector.ts"

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
