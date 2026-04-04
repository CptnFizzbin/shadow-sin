import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { getSkillsInGroup } from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/skill-group-utils.ts"
import { getActiveSkillGroupBp } from "#/components/CharacterBuilder/Sections/Skills/skills-builder-utils.ts"
import type { SkillGroupData } from "#/lib/system/skill-data.ts"

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
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {group.name}
        </Typography>
        <Chip
          label={group.rating}
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

      {memberSkills.length > 0 && (
        <Typography variant="caption" color="text.secondary">
          {memberSkills.join(", ")}
        </Typography>
      )}
    </Box>
  )
}
