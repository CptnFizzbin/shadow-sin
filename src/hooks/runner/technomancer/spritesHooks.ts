import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { useEntitySelector } from "#/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useMaxSpritesRegistered = () => {
  return useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.charisma })
}

export const useMaxSpriteTasks = () => {
  return useActiveSkill(SkillKey.compiling)
}
