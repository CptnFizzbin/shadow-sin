import { useBuilderStore } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import type { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { Skills } from "#/lib/system/types/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export function useBuilderAttrValue(attrKey: AttributeKey) {
  return useBuilderStore((state) => state.attributes[attrKey])
}

export function useBuilderActiveSkillRating(skillKey: SkillKey) {
  const { group } = Skills[skillKey]

  const activeSkills = useBuilderStore((state) => state.skills.activeSkills)
  const skillRating = activeSkills.find((s) => s.name === skillKey)?.rating ?? 0

  const activeSkillGroups = useBuilderStore(
    (state) => state.skills.activeSkillGroups,
  )
  const groupRating =
    activeSkillGroups.find((g) => g.groupName === group)?.rating ?? 0

  return Math.max(skillRating, groupRating, 0)
}

export function useBuilderAwakeningType() {
  return useBuilderStore((state) => state.awakening)
}

export function useBuilderWarnings() {
  return []
}
