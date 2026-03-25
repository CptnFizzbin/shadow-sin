import { useBuilderStoreSlice } from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import {
  useBuilderActiveSkillRating,
  useBuilderAttrValue,
  useBuilderAwakeningType,
} from "#/components/CharacterBuilder/CharacterBuilderHooks.ts"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Resources/Technomancer/SpritesUtils.ts"
import { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const useSpritesSlice = () => {
  return useBuilderStoreSlice(
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
