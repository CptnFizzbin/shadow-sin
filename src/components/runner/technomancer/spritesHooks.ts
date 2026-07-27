import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { useAttrValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSprites = () => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const sprites = useRunnerStoreSelector(Selectors.sprites.selectSprites)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return sprites
}

export const useMaxSpritesRegistered = () => {
  return useAttrValue(AttributeKey.charisma)
}

export const useMaxSpriteTasks = () => {
  return useActiveSkill(SkillKey.compiling)
}
