import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useActiveSkill, useAttr } from "#/components/character/characterUtils.ts"
import { useSpritesStore } from "#/components/technomancer/useSpritesStore.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"
import { SkillKey } from "#/lib/system/skillKey.ts"

export const useSprites = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const spritesStore = useSpritesStore()
  const sprites = useStore(spritesStore, (state) => state)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return sprites
}

export const useMaxSpritesRegistered = () => {
  return useAttr(AttributeKey.charisma)
}

export const useSpriteRating = () => {
  return useAttr(AttributeKey.resonance)
}

export const useMaxSpriteTasks = () => {
  return useActiveSkill(SkillKey.compiling)
}
