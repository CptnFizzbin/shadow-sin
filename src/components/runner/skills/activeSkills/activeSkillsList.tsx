import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import { sort } from "fast-sort"
import type { FC } from "react"
import { useMemo, useState } from "react"

import { SkillListPanel } from "#/components/runner/skills/skillListPanel.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import { SkillCategory } from "#/system/skills/skillCategory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { ActiveSkillsListItem } from "./activeSkillsListItem.tsx"

type GroupingMode = "type" | "attribute" | "group" | "category"

const groupingModeLabels: Record<GroupingMode, string> = {
  type: "Type",
  attribute: "Attribute",
  group: "Group",
  category: "Category",
}

const skillCategoryOrder = Object.values(SkillCategory)

export const ActiveSkillsList: FC = () => {
  const activeSkills = useRunnerStoreSelector(Selectors.skills.selectActiveSkills)
  const skillGroups = useRunnerStoreSelector(Selectors.skills.selectSkillGroups)

  const [searchQuery, setSearchQuery] = useState("")
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("type")

  const skillEntries = useMemo(() => {
    return Object.values(SkillKey)
      .map((skillKey) => {
        const skillInfo = skillList[skillKey]
        const groupRating = skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
        const activeSkill = activeSkills.find((s) => s.name === skillKey)
        const skillRating = Math.max(activeSkill?.rating ?? 0, groupRating, 0)
        const skillSpecialization = activeSkill?.specialization
        return { key: skillKey, ...skillInfo, rating: skillRating, specialization: skillSpecialization }
      }).filter((skillInfo) => {
        return skillInfo.rating >= 1 || (skillInfo.defaultable ?? true)
      })
  }, [activeSkills, skillGroups])

  const visibleSkills = sort(skillEntries)
    .by([
      { desc: (skill) => skill.rating >= 1 },
      { asc: (skill) => skill.key },
    ])
    .filter((skill) => {
      const searchSpace = [skill.key, skill.group ?? "", skill.category, skill.specialization ?? ""].join("|").toLowerCase()
      return searchSpace.includes(searchQuery.toLowerCase())
    })

  const groupedSkills = useMemo((): [string, typeof visibleSkills][] => {
    if (groupingMode === "type") {
      const byType = Object.groupBy(visibleSkills, (s) => s.rating >= 1 ? "Skilled" : "Defaulted")
      return [
        ...(byType["Skilled"] ? [["Skilled", byType["Skilled"]] as [string, typeof visibleSkills]] : []),
        ...(byType["Defaulted"] ? [["Defaulted", byType["Defaulted"]] as [string, typeof visibleSkills]] : []),
      ]
    }

    if (groupingMode === "attribute") {
      const byAttr = Object.groupBy(visibleSkills, (s) => AttributeLabels[s.attr])
      return Object.entries(byAttr)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, value ?? []])
    }

    if (groupingMode === "group") {
      const withGroup = visibleSkills.filter((s) => s.group)
      const withoutGroup = visibleSkills.filter((s) => !s.group)
      const byGroup = Object.groupBy(withGroup, (s) => s.group ?? "")
      const groupedEntries = Object.entries(byGroup)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, value ?? []] as [string, typeof visibleSkills])
      if (withoutGroup.length > 0) {
        groupedEntries.push(["Ungrouped", withoutGroup])
      }
      return groupedEntries
    }

    const byCategory = Object.groupBy(visibleSkills, (s) => s.category)
    return skillCategoryOrder
      .filter((cat) => byCategory[cat]?.length)
      .map((cat) => [cat, byCategory[cat] ?? []])
  }, [visibleSkills, groupingMode])

  return (
    <SkillListPanel
      searchPlaceholder="Search skills…"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      groups={groupedSkills}
      getKey={(skill) => skill.key}
      renderItem={(skill) => (
        <ActiveSkillsListItem
          skillKey={skill.key}
          rating={skill.rating}
        />
      )}
      emptyMessage="No skills found"
      headerControls={(
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Typography color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            Group by:
          </Typography>
          <ToggleButtonGroup
            value={groupingMode}
            exclusive
            onChange={(_, newMode) => newMode && setGroupingMode(newMode)}
            size="small"
            sx={{ flexWrap: "wrap" }}
          >
            {(Object.keys(groupingModeLabels) as GroupingMode[]).map((mode) => (
              <ToggleButton key={mode} value={mode} sx={{ py: 0.25, px: 1, fontSize: "0.7rem" }}>
                {groupingModeLabels[mode]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      )}
    />
  )
}
