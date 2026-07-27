import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getSpriteTasksBp } from "#/components/builder/sections/resources/technomancer/sprites/spritesUtils.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import { useSprites } from "#/lib/hooks/runner/technomancer/spritesHooks.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useSpritesBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const sprites = useSprites()

  const spritesBp = sprites
    .map(getSpriteTasksBp)
    .reduce((total, cost) => total + cost, 0)

  return {
    sectionId: BuilderSectionId.sprites,
    spent: spritesBp,
    enabled: isTechnomancer(awakeningType),
  }
}
