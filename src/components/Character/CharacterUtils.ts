import { useCharacterStore } from "#/components/Character/CharacterStoreProvider.tsx"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import { Skills } from "#/lib/system/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"

export const useAttr = (attribute: AttributeKey) => {
  return useCharacterStore((state) => {
    return state.attributes[attribute]
  })
}

export const useSkill = (skill: SkillKey) => {
  const attr = Skills[skill].attr
  const skillRating = useCharacterStore((state) => {
    return state.skills[skill]?.rating || 0
  })

  const attribute = useAttr(attr)
  return skillRating + attribute
}
