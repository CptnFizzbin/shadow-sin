import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import type { BpLineItem } from "#/components/characterBuilder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { getSpriteTasksBp } from "#/components/characterBuilder/sections/resources/technomancer/sprites/spritesUtils.ts"
import { useSprites } from "#/components/technomancer/spritesHooks.ts"
import { isTechnomancer } from "#/components/technomancer/technomancerUtils.ts"

export const useSpritesBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
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
