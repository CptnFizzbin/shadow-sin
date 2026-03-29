import { useActiveSkill } from "#/components/Character/CharacterUtils.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"

export function useBuilderActiveSkillRating(skillKey: SkillKey) {
  return useActiveSkill(skillKey)
}
