import type { SkillGroupKey } from "#/lib/system/skill-group-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"
import { Skills } from "#/lib/system/skill-key.ts"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(Skills)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
