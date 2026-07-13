import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getSpriteTasksBp } from "#/components/builder/sections/resources/technomancer/sprites/spritesUtils.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { useSprites } from "#/components/runner/technomancer/spritesHooks.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"

export const useSpritesBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerData((sheet) => sheet.biology.awakening)
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
