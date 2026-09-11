import Box from "@mui/material/Box"
import type { FC } from "react"

import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { SkillListItem } from "./skillListItem.tsx"

interface SkillSelectListItemProps {
  skill: SkillKey
  isSelected: boolean
  /** Overrides the skill's own natural attribute (e.g. a weapon's configured attribute). */
  attrOverride?: AttributeKey
  /** When false and the skill is untrained, this row renders nothing. */
  includeDefaulting: boolean
  onSelect: () => void
}

/**
 * One row of a `SkillSelectList` — fetches its own current rating rather than the caller
 * precomputing every candidate's rating up front, so the candidate list can change freely without
 * the caller needing a fixed-order block of selector hooks. Renders nothing when the skill is
 * untrained and `includeDefaulting` is false.
 */
export const SkillSelectListItem: FC<SkillSelectListItemProps> = ({
  skill,
  isSelected,
  attrOverride,
  includeDefaulting,
  onSelect,
}) => {
  const rating = useRunnerSelector(SkillsSelectors.selectValue, { skillName: skill })
  const defaultable = skillList[skill].defaultable ?? true
  const isDefaulted = rating === 0 && defaultable

  if (rating === 0 && !includeDefaulting) return null

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: "1px solid",
        borderColor: isSelected ? "secondary.main" : "divider",
        backgroundColor: isSelected ? "action.selected" : undefined,
      }}
    >
      <SkillListItem
        name={skill}
        rating={rating}
        attr={attrOverride ?? skillList[skill].attr}
        isDefaulted={isDefaulted}
        onClick={onSelect}
      />
    </Box>
  )
}
