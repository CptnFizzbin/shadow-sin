import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"

/** Rating chip shared by active/knowledge skill and skill-group list items. */
export const SkillRatingChip: FC<{ rating: ReactNode }> = ({ rating }) => (
  <Chip
    label={rating}
    size="small"
    variant="outlined"
    sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
  />
)

/** Inline specialization note shared by active/knowledge skill list items. */
export const SkillSpecializationText: FC<{ specialization?: string }> = ({ specialization }) => (
  specialization
    ? (
        <Typography color="text.secondary" sx={{ pl: 0.5 }}>
          {specialization}
        </Typography>
      )
    : null
)

interface SkillListItemProps {
  name: string
  secondaryText?: ReactNode
  belowContent?: ReactNode
  chip: ReactNode
  cost: ReactNode
  onEdit: () => void
  onDelete: () => void
}

/**
 * Shared row chrome for active/knowledge/language skill and skill-group
 * list items: clickable container, name, rating chip, cost display, and
 * a delete button that doesn't trigger the row's onEdit.
 */
export const SkillListItem: FC<SkillListItemProps> = ({
  name,
  secondaryText,
  belowContent,
  chip,
  cost,
  onEdit,
  onDelete,
}) => {
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
          {name}
        </Typography>

        {secondaryText}

        {chip}
        {cost}

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

      {belowContent}
    </Box>
  )
}
