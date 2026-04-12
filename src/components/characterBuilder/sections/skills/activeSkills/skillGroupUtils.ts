import type { SkillGroupKey } from "#/lib/system/skillGroupKey.ts"
import type { SkillKey } from "#/lib/system/skillKey.ts"
import { skillsList } from "#/lib/system/skillsList"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(skillsList)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
