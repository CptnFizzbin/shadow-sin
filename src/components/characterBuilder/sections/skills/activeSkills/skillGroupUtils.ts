import type { SkillGroupKey } from "#/lib/system/skillGroupKey.ts"
import type { SkillKey } from "#/lib/system/skillKey.ts"
import { skills } from "#/lib/system/skillKey.ts"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(skills)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
