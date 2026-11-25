import type { SkillGroupKey } from "./skillGroupKey.ts"
import type { SkillKey } from "./skillKey.ts"
import { skillList } from "./skillList.ts"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(skillList)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
