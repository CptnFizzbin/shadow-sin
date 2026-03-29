import { useStore } from "@tanstack/react-store"

import { useBuilderActiveSkillRating } from "#/components/CharacterBuilder/Hooks/UseBuilderActiveSkillRating.ts"
import { useBuilderAttrValue } from "#/components/CharacterBuilder/Hooks/UseBuilderAttrValue.ts"
import { useBuilderAwakeningType } from "#/components/CharacterBuilder/Hooks/UseBuilderAwakeningType.ts"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/SpritesUtils.ts"
import { useSpritesStore } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseSpritesStore.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const useSprites = () => {
  const awakeningType = useBuilderAwakeningType()
  const spritesStore = useSpritesStore()
  const sprites = useStore(spritesStore, (state) => state)

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
