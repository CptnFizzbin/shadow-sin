import type { SkillGroupKey } from "#/lib/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/lib/system/skills/skillKey.ts"
import { skillList } from "#/lib/system/skills/skillList.ts"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(skillList)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
