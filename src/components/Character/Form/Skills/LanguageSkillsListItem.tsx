import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import type { LanguageSkillFormState } from "#/components/Character/Form/Skills/SkillFormState.ts"
import { getLanguageSkillSp } from "#/components/Character/Form/Skills/SkillRequirements.ts"

interface LanguageSkillsListItemProps {
  skill: LanguageSkillFormState
  onEdit: () => void
  onDelete: () => void
}

export const LanguageSkillsListItem: FC<LanguageSkillsListItemProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const spCost = getLanguageSkillSp(
    skill.isNative,
    skill.rating,
    !!skill.specialization,
  )

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {skill.name}
        </Typography>

        {skill.specialization && (
          <Typography variant="caption" color="text.secondary">
            Lingo: {skill.specialization}
          </Typography>
        )}

        <Chip
          label={skill.isNative ? "N" : skill.rating}
          size="small"
          variant={skill.isNative ? "filled" : "outlined"}
          color={skill.isNative ? "success" : "default"}
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="warning.main"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {spCost} SP
        </Typography>
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
