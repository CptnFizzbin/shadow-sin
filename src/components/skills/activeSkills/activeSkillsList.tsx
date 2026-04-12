import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import { RiSearchLine } from "@remixicon/react"
import { sort } from "fast-sort"
import type { FC } from "react"
import { Fragment, useMemo, useState } from "react"

import { ActiveSkillsListItem } from "#/components/skills/activeSkills/activeSkillsListItem.tsx"
import { useSkillsStore } from "#/components/skills/useSkillsStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { AttributeLabels } from "#/lib/system/attributeKey.ts"
import { SkillCategory } from "#/lib/system/skillCategory.ts"
import { SkillKey } from "#/lib/system/skillKey.ts"
import { skillsList } from "#/lib/system/skillsList"

type GroupingMode = "type" | "attribute" | "group" | "category"

const groupingModeLabels: Record<GroupingMode, string> = {
  type: "Type",
  attribute: "Attribute",
  group: "Group",
  category: "Category",
}

const skillCategoryOrder = Object.values(SkillCategory)

export const ActiveSkillsList: FC = () => {
  const skillsStore = useSkillsStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("type")

  const skillEntries = useMemo(() => {
    return Object.values(SkillKey)
      .map((skillKey) => {
        const skillInfo = skillsList[skillKey]
        const skillRating = skillsStore.activeSkills.getSkillValue(skillKey)
        const skillSpecialization = skillsStore.activeSkills.getSpecialization(skillKey)
        return { key: skillKey, ...skillInfo, rating: skillRating, specialization: skillSpecialization }
      }).filter((skillInfo) => {
        return skillInfo.rating >= 1 || (skillInfo.defaultable ?? true)
      })
  }, [skillsStore])

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

    // category grouping
    const byCategory = Object.groupBy(visibleSkills, (s) => s.category)
    return skillCategoryOrder
      .filter((cat) => byCategory[cat]?.length)
      .map((cat) => [cat, byCategory[cat] ?? []])
  }, [visibleSkills, groupingMode])

  return (
    <>
      <TextField
        size="small"
        placeholder="Search skills…"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine size={16} />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
      />

      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
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

      <Stack>
        {visibleSkills.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            No skills found
          </Typography>
        )}

        {groupedSkills.map(([group, groupSkills]) => (
          <Fragment key={group}>
            <Label label={group} />
            {groupSkills.map((skill) => (
              <ActiveSkillsListItem
                key={skill.key}
                skillKey={skill.key}
                rating={skill.rating}
              />
            ))}
          </Fragment>
        ))}
      </Stack>
    </>
  )
}
