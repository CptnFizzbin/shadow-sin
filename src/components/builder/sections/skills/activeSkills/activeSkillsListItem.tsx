import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { getActiveSkillBp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useIsEditMode } from "#/stores/builder/editMode.context.ts"
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
  const isEditMode = useIsEditMode()

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
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ flexGrow: 1 }}>
          {skill.name}
        </Typography>

        {skill.specialization && (
          <Typography color="text.secondary" sx={{ pl: 0.5 }}>
            {skill.specialization}
          </Typography>
        )}

        <Chip
          label={skill.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />
        {!isEditMode && (
          <Typography
            color="secondary.main"
            sx={{ minWidth: 40, textAlign: "right" }}
          >
            {bpCost} BP
          </Typography>
        )}
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
