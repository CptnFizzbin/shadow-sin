import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { SpriteSelectors } from "#/lib/stores/runner/sprites/spritesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

/** @deprecated Use `SpriteSelectors.selectVisible` via `useRunnerSelector` instead. */
export const useSprites = () => {
  return useRunnerSelector(SpriteSelectors.selectVisible)
}

export const useMaxSpritesRegistered = () => {
  return useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.charisma })
}

export const useMaxSpriteTasks = () => {
  return useActiveSkill(SkillKey.compiling)
}
