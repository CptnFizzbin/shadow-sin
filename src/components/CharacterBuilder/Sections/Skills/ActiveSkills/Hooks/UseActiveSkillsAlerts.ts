import { getSkillsInGroup } from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/SkillGroupUtils.ts"
import {
  useBuilderActiveSkillsApi,
  useBuilderSkillGroupsApi,
} from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsApi.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useActiveSkillsAlerts = (): AlertInfo[] => {
  const activeSkillsApi = useBuilderActiveSkillsApi()
  const skillGroupsApi = useBuilderSkillGroupsApi()

  const statuses: AlertInfo[] = []

  const r6Count = activeSkillsApi.skills.filter((s) => s.rating >= 6).length
  const r5Count = activeSkillsApi.skills.filter((s) => s.rating === 5).length

  if (r6Count > 1 || r5Count > 2 || (r6Count === 1 && r5Count > 0)) {
    statuses.push({
      section: "Skills",
      severity: "error",
      title: "Active Skills",
      message: "Only allowed one Rating 6 skill OR two Rating 5 skills, with all other skills at Rating 4 or below.",
    })
  }

  if (activeSkillsApi.skills.length > 0 && skillGroupsApi.skillGroups.length > 0) {
    const groupSkillSets = new Map<string, Set<string>>()

    for (const group of skillGroupsApi.skillGroups) {
      const members = getSkillsInGroup(group.groupName)
      groupSkillSets.set(group.groupName, new Set(members as string[]))
    }

    for (const skill of activeSkillsApi.skills) {
      const groupsContaining: string[] = []

      for (const [groupName, skillSet] of groupSkillSets.entries()) {
        if (skillSet.has(skill.name)) groupsContaining.push(groupName)
      }

      if (groupsContaining.length > 0) {
        const plural = groupsContaining.length > 1 ? "groups" : "group"
        statuses.push({
          section: "Skills",
          severity: "error",
          title: "Active Skills",
          message: `Active skills: "${skill.name}" is selected individually and also via selected ${plural}: ${groupsContaining.join(", ")}. A skill may be purchased either individually or as part of a skill group, but not both.`,
        })
      }
    }
  }

  return statuses
}
