import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { Selectors, useRunnerSelector, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { SpriteSelectors } from "#/lib/stores/runner/sprites/spritesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSprites = () => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const sprites = useRunnerSelector(SpriteSelectors.selectAll)

  if (awakeningType !== AwakeningType.Technomancer) {
    return []
  }

  return sprites
}

export const useMaxSpritesRegistered = () => {
  return useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.charisma })
}

export const useMaxSpriteTasks = () => {
  return useActiveSkill(SkillKey.compiling)
}
