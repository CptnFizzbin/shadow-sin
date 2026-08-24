import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEditorMode } from "#/contexts/builder/editorMode.tsx"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"

export const useActiveSkillsAlerts = (): AlertInfo[] => {
  const activeSkills = useRunnerSelector(SkillsSelectors.selectActiveSkills)
  const skillGroups = useRunnerSelector(SkillsSelectors.selectSkillGroups)
  const editorMode = useEditorMode()

  const statuses: AlertInfo[] = []

  const r6Count = activeSkills.filter((s) => s.rating >= 6).length
  const r5Count = skillGroups.filter((s) => s.rating === 5).length

  if ((r6Count > 1 || r5Count > 2 || (r6Count === 1 && r5Count > 0)) && editorMode.isBuilder) {
    statuses.push({
      section: "Skills",
      severity: "error",
      title: "Active Skills",
      message: "Only allowed one Rating 6 skill OR two Rating 5 skills, with all other skills at Rating 4 or below.",
    })
  }

  if (activeSkills.length > 0 && skillGroups.length > 0) {
    const groupSkillSets = new Map<string, Set<string>>()

    for (const group of skillGroups) {
      const members = getSkillsInGroup(group.name)
      groupSkillSets.set(group.name, new Set(members as string[]))
    }

    for (const skill of activeSkills) {
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
