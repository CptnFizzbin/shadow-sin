import { useSelector } from "@tanstack/react-store"

import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useActiveSkill } from "#/components/character/skills/useActiveSkillHooks.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { selectAllSprites } from "./spritesSelectors.ts"
import { useSpritesStore } from "./useSpritesStore.ts"

export const useSprites = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const spritesStore = useSpritesStore()
  const sprites = useSelector(spritesStore, selectAllSprites)

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
