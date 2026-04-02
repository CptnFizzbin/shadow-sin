import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/SpritesUtils.ts"
import { useSprites } from "#/components/Technomancer/SpritesHooks.ts"
import { isTechnomancer } from "#/components/Technomancer/TechnomancerUtils.ts"

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
