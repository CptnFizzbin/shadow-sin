import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
} from "#/components/Character/Form/Skills/SkillFormState.ts"
import { getSkillsInGroup } from "#/components/Character/Form/Skills/SkillGroups.ts"

export function getDisabledSkills(
  activeSkills: ActiveSkillFormState[],
  activeSkillGroups: ActiveSkillGroupFormState[],
  editingSkillId: string | null,
): Set<string> {
  const skillsCoveredByGroups = new Set<string>(
    activeSkillGroups.flatMap((group) => getSkillsInGroup(group.groupName)),
  )
  return new Set<string>([
    ...activeSkills.filter((s) => s.id !== editingSkillId).map((s) => s.name),
    ...skillsCoveredByGroups,
  ])
}

export function getDisabledGroups(
  activeSkillGroups: ActiveSkillGroupFormState[],
  editingGroupId: string | null,
): Set<string> {
  return new Set<string>(
    activeSkillGroups
      .filter((g) => g.id !== editingGroupId)
      .map((g) => g.groupName),
  )
}
