import { getSkillsInGroup } from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/SkillGroupUtils.ts"
import type { SkillGroupKey } from "#/lib/system/SkillGroupKey.ts"
import type { SkillKey } from "#/lib/system/SkillKey.ts"
import type { ActiveSkillData, SkillGroupData } from "#/lib/system/skillData.ts"

export function getDisabledSkills(
  activeSkills: ActiveSkillData[],
  activeSkillGroups: SkillGroupData[],
  editingSkillName: SkillKey | null,
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
  editingGroupName: SkillGroupKey | null,
): Set<string> {
  return new Set<string>(
    activeSkillGroups
      .filter((g) => g.name !== editingGroupName)
      .map((g) => g.name),
  )
}
