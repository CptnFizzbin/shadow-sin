import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { Skills } from "#/lib/system/types/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export function useBuilderAttrValue(attrKey: AttributeKey) {
  return useCharacterBuilderStore((state) => state.attributes[attrKey]?.value)
}

export function useBuilderActiveSkillRating(skillKey: SkillKey) {
  const { group } = Skills[skillKey]

  const activeSkills = useCharacterBuilderStore(
    (state) => state.skills.activeSkills,
  )
  const skillRating = activeSkills.find((s) => s.name === skillKey)?.rating ?? 0

  const activeSkillGroups = useCharacterBuilderStore(
    (state) => state.skills.activeSkillGroups,
  )
  const groupRating =
    activeSkillGroups.find((g) => g.groupName === group)?.rating ?? 0

  return Math.max(skillRating, groupRating, 0)
}

export function useBuilderAwakeningType() {
  return useCharacterBuilderStore((state) => state.awakening)
}

export function useBuilderWarnings() {
  return []
}
