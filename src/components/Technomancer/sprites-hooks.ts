import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useActiveSkill, useAttr } from "#/components/Character/character-utils.ts"
import { useSpritesStore } from "#/components/Technomancer/use-sprites-store.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { AwakeningType } from "#/lib/system/awakening-type.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

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
