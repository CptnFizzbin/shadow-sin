import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/SpritesUtils.ts"
import { useSprites } from "#/components/Technomancer/SpritesHooks.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const useSpritesBuildPoints = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const sprites = useSprites()

  if (awakeningType !== AwakeningType.Technomancer) {
    return { spent: 0 }
  }

  const spritesBp = sprites
    .map(getSpriteTasksBp)
    .reduce((total, cost) => total + cost, 0)

  return { spent: spritesBp }
}
