import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SkillListItem, SkillRatingChip, SkillSpecializationText } from "#/components/builder/sections/skills/skillListItem.tsx"
import { getKnowledgeSkillSp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"

interface KnowledgeSkillsListItemProps {
  skill: KnowledgeSkillData
  onEdit: () => void
  onDelete: () => void
}

export const KnowledgeSkillsListItem: FC<KnowledgeSkillsListItemProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const spCost = getKnowledgeSkillSp(skill)

  return (
    <SkillListItem
      name={skill.name}
      secondaryText={<SkillSpecializationText specialization={skill.specialization} />}
      chip={<SkillRatingChip rating={skill.rating} />}
      cost={(
        <Typography color="warning.main" sx={{ minWidth: 40, textAlign: "right" }}>
          {spCost} SP
        </Typography>
      )}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
