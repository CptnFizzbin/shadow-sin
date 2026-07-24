import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { getActiveSkillGroupBp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useIsEditMode } from "#/stores/builder/editMode.context.ts"
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
          {group.name}
        </Typography>
        <Chip
          label={group.rating}
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

      {memberSkills.length > 0 && (
        <Typography color="text.secondary">
          {memberSkills.join(", ")}
        </Typography>
      )}
    </Box>
  )
}
