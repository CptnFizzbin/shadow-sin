import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { useActiveSkill, useAttr } from "#/components/Character/CharacterUtils.ts"
import { useSpritesStore } from "#/components/Technomancer/UseSpritesStore.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

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
