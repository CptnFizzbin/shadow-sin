import { getSkillsInGroup } from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/skill-group-utils.ts"
import type { ActiveSkillData, SkillGroupData } from "#/lib/system/skill-data.ts"
import type { SkillGroupKey } from "#/lib/system/skill-group-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"

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
