import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import type { SkillGroupData } from "#/system/skills/skillGroupData"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

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
