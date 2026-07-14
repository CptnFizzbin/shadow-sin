import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SkillListItem } from "#/components/builder/sections/skills/skillListItem.tsx"
import { getLanguageSkillSp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { SkillPoints } from "#/components/ui/skillPoints.tsx"
import type { LanguageSkillData } from "#/system/skills/languageSkillData"

interface LanguageSkillsListItemProps {
  skill: LanguageSkillData
  onEdit: () => void
  onDelete: () => void
}

export const LanguageSkillsListItem: FC<LanguageSkillsListItemProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const spCost = getLanguageSkillSp(skill)
  const isNative = skill.rating === "native"

  return (
    <SkillListItem
      name={skill.name}
      secondaryText={skill.lingo && (
        <Typography color="text.secondary">
          Lingo: {skill.lingo}
        </Typography>
      )}
      chip={(
        <Chip
          label={isNative ? "N" : skill.rating}
          size="small"
          variant={isNative ? "filled" : "outlined"}
          color={isNative ? "success" : "default"}
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
      )}
      cost={<SkillPoints value={spCost} sx={{ minWidth: 40, textAlign: "right" }} />}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
