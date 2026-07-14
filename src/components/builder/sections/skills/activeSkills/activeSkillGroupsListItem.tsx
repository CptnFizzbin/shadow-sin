import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SkillListItem, SkillRatingChip } from "#/components/builder/sections/skills/skillListItem.tsx"
import { getActiveSkillGroupBp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData"

import { getSkillsInGroup } from "./skillGroupUtils.ts"

interface ActiveSkillGroupsListItemProps {
  group: SkillGroupData
  onEdit: () => void
  onDelete: () => void
}

export const ActiveSkillGroupsListItem: FC<ActiveSkillGroupsListItemProps> = ({
  group,
  onEdit,
  onDelete,
}) => {
  const bpCost = getActiveSkillGroupBp(group)
  const memberSkills = getSkillsInGroup(group.name)

  return (
    <SkillListItem
      name={group.name}
      chip={<SkillRatingChip rating={group.rating} />}
      cost={(
        <Typography color="secondary.main" sx={{ minWidth: 40, textAlign: "right" }}>
          {bpCost} BP
        </Typography>
      )}
      belowContent={memberSkills.length > 0 && (
        <Typography color="text.secondary">
          {memberSkills.join(", ")}
        </Typography>
      )}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
