import { useSelector } from "@tanstack/react-store"

import { useActiveSkill, useAttr } from "#/components/runner/runnerUtils.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { selectAllSprites } from "./spritesSelectors.ts"
import { useSpritesStore } from "./useSpritesStore.ts"

export const useSprites = () => {
  const awakeningType = useRunnerData((sheet) => sheet.biology.awakening)
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
