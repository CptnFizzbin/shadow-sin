import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/bp-line-item.ts"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/sprites-utils.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { useSprites } from "#/components/Technomancer/sprites-hooks.ts"
import { isTechnomancer } from "#/components/Technomancer/technomancer-utils.ts"

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
