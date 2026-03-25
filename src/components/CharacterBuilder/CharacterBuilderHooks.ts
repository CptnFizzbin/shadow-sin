import { useBuildStateStore } from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import type { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { Skills } from "#/lib/system/types/SkillKey.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export function useBuilderAttrValue(attrKey: AttributeKey) {
  return useBuildStateStore((state) => state.attributes[attrKey])
}

export function useBuilderActiveSkillRating(skillKey: SkillKey) {
  const { group } = Skills[skillKey]

  const activeSkills = useBuildStateStore((state) => state.skills.activeSkills)
  const skillRating = activeSkills.find((s) => s.name === skillKey)?.rating ?? 0

  const activeSkillGroups = useBuildStateStore(
    (state) => state.skills.activeSkillGroups,
  )
  const groupRating =
    activeSkillGroups.find((g) => g.groupName === group)?.rating ?? 0

  return Math.max(skillRating, groupRating, 0)
}

export function useBuilderAwakeningType() {
  return useBuildStateStore((state) => state.awakening)
}

export function useBuilderWarnings() {
  return []
}
