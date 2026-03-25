import type { SkillGroupKey } from "#/lib/system/types/SkillGroupKey.ts"
import type { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { Skills } from "#/lib/system/types/SkillKey.ts"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(Skills)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
