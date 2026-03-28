import { useBuilderActiveSkillRating } from "#/components/CharacterBuilder/Hooks/UseBuilderActiveSkillRating.ts"
import { useBuilderAttrValue } from "#/components/CharacterBuilder/Hooks/UseBuilderAttrValue.ts"
import { useBuilderAwakeningType } from "#/components/CharacterBuilder/Hooks/UseBuilderAwakeningType.ts"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/SpritesUtils.ts"
import { useBuilderSpritesApi } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseSpritesApi.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const useSprites = () => {
  const awakeningType = useBuilderAwakeningType()
  const { sprites } = useBuilderSpritesApi()

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return sprites
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
