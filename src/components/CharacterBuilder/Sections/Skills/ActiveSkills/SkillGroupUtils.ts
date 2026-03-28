import type { SkillGroupKey } from "#/lib/system/SkillGroupKey.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import { Skills } from "#/lib/system/SkillKey.ts"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(Skills)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
