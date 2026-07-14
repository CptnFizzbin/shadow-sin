import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SkillListItem, SkillRatingChip, SkillSpecializationText } from "#/components/builder/sections/skills/skillListItem.tsx"
import { getActiveSkillBp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"

interface ActiveSkillsListItemProps {
  skill: ActiveSkillData
  onEdit: () => void
  onDelete: () => void
}

export const ActiveSkillsListItem: FC<ActiveSkillsListItemProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const bpCost = getActiveSkillBp(skill)

  return (
    <SkillListItem
      name={skill.name}
      secondaryText={<SkillSpecializationText specialization={skill.specialization} />}
      chip={<SkillRatingChip rating={skill.rating} />}
      cost={(
        <Typography color="secondary.main" sx={{ minWidth: 40, textAlign: "right" }}>
          {bpCost} BP
        </Typography>
      )}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
