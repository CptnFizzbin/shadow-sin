import {
  useBuilderActiveSkillRating,
  useBuilderAttrValue,
  useBuilderAwakeningType,
} from "#/components/CharacterBuilder/CharacterBuilderHooks.ts"
import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Resources/Technomancer/SpritesUtils.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const useSpritesSlice = () => {
  return useCharacterBuilderStoreSlice(
    (state) => state.awakened.sprites,
    (state, sprites) => {
      state.awakened.sprites = sprites
      return state
    },
  )
}
export const useSprites = () => {
  const awakeningType = useBuilderAwakeningType()
  const spritesSlice = useSpritesSlice()

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return spritesSlice.state
}
export const useSpritesBuildPoints = () => {
  const awakeningType = useBuilderAwakeningType()
  const sprites = useSprites()

  if (awakeningType !== AwakeningType.Technomancer) {
    return { spent: 0 }
  }

  const spritesBp = sprites
    .map(getSpriteTasksBp)
    .reduce((total, cost) => total + cost, 0)

  return { spent: spritesBp }
}

export const useMaxSpritesRegistered = () => {
  return useBuilderAttrValue(AttributeKey.charisma)
}

export const useSpriteRating = () => {
  return useBuilderAttrValue(AttributeKey.resonance)
}

export const useMaxSpriteTasks = () => {
  return useBuilderActiveSkillRating(SkillKey.compiling)
}
