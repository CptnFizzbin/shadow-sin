import type { SkillGroupKey } from "#/lib/system/skill-group-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"
import { skills } from "#/lib/system/skill-key.ts"

export const getSkillsInGroup = (groupName: SkillGroupKey): SkillKey[] => {
  return Object.entries(skills)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
