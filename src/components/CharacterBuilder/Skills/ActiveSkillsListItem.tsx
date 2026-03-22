import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import type { ActiveSkillFormState } from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import { getActiveSkillBp } from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"

interface ActiveSkillsListItemProps {
  skill: ActiveSkillFormState
  onEdit: () => void
  onDelete: () => void
}

export const ActiveSkillsListItem: FC<ActiveSkillsListItemProps> = ({
  skill,
  onEdit,
  onDelete,
}) => {
  const bpCost = getActiveSkillBp(skill.rating, !!skill.specialization)

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
          <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
            {skill.specialization}
          </Typography>
        )}

        <Chip
          label={skill.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        <Typography
          variant="caption"
          color="secondary.main"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {bpCost} BP
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
