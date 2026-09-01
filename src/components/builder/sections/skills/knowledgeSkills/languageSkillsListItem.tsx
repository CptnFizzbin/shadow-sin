import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

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
  const isNative = skill.isNative

  return (
    <Box
      sx={{
        "p": 1,
        "borderRadius": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography sx={{ flexGrow: 1 }}>
          {skill.name}
        </Typography>

        {skill.lingo && (
          <Typography color="text.secondary">
            Lingo: {skill.lingo}
          </Typography>
        )}

        <Chip
          label={skill.isNative ? "N" : skill.rating}
          size="small"
          variant={isNative ? "filled" : "outlined"}
          color={isNative ? "success" : "default"}
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <SkillPoints

          value={spCost}
          sx={{ minWidth: 40, textAlign: "right" }}
        />
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <RiDeleteBin6Line size={14} />
        </IconButton>
      </Stack>
    </Box>
  )
}
