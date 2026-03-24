import { useCharacterSheet } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { Skills } from "#/lib/system/types/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export function useBuilderAttrValue(attrKey: AttributeKey) {
  return useCharacterSheet((state) => state.attributes[attrKey])
}

export function useBuilderActiveSkillRating(skillKey: SkillKey) {
  const { group } = Skills[skillKey]

  const activeSkills = useCharacterSheet((state) => state.skills.activeSkills)
  const skillRating = activeSkills.find((s) => s.name === skillKey)?.rating ?? 0

  const activeSkillGroups = useCharacterSheet(
    (state) => state.skills.activeSkillGroups,
  )
  const groupRating =
    activeSkillGroups.find((g) => g.groupName === group)?.rating ?? 0

  return Math.max(skillRating, groupRating, 0)
}

export function useBuilderAwakeningType() {
  return useCharacterSheet((state) => state.awakening)
}

export function useBuilderWarnings() {
  return []
}
