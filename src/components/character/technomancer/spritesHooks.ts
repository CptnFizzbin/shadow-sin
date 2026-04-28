import { useStore } from "@tanstack/react-store"

import { useActiveSkill, useAttr } from "#/components/character/characterUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { selectAllSprites } from "./spritesSelectors.ts"
import { useSpritesStore } from "./useSpritesStore.ts"

export const useSprites = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const spritesStore = useSpritesStore()
  const sprites = useStore(spritesStore, selectAllSprites)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return sprites
}

export const useMaxSpritesRegistered = () => {
  return useAttr(AttributeKey.charisma)
}

export const useMaxSpriteTasks = () => {
  return useActiveSkill(SkillKey.compiling)
}
