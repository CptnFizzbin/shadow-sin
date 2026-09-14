import type { ActiveSkillData } from "#/system/model/skills/activeSkillData.ts"
import type { SkillGroupData } from "#/system/model/skills/skillGroupData.ts"
import type { SkillGroupKey } from "#/system/model/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

import { getSkillsInGroup } from "./skillGroupUtils.ts"

export function getDisabledSkills(
  activeSkills: ActiveSkillData[],
  activeSkillGroups: SkillGroupData[],
  editingSkillName: SkillKey | undefined,
): Set<string> {
  const skillsCoveredByGroups = new Set<string>(
    activeSkillGroups.flatMap((group) => getSkillsInGroup(group.name)),
  )
  return new Set<string>([
    ...activeSkills.filter((s) => s.name !== editingSkillName).map((s) => s.name),
    ...skillsCoveredByGroups,
  ])
}

export function getDisabledGroups(
  activeSkillGroups: SkillGroupData[],
  editingGroupName: SkillGroupKey | undefined,
): Set<string> {
  return new Set<string>(
    activeSkillGroups
      .filter((g) => g.name !== editingGroupName)
      .map((g) => g.name),
  )
}
