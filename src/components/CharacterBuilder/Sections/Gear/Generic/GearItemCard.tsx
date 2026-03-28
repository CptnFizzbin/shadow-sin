import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { GearMaxAvailability } from "#/components/CharacterBuilder/Sections/Gear/GearUtils.ts"
import type { GearItemFormState } from "#/components/CharacterBuilder/Sections/Gear/Generic/Forms/GearItemFormState.ts"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"

interface GearItemCardProps {
  item: GearItemFormState
  onEdit: () => void
  onRemove: () => void
}

export const GearItemCard: FC<GearItemCardProps> = ({
  item,
  onEdit,
  onRemove,
}) => {
  const { availability, source, description } = item

  return (
    <Stack
      direction="column"
      sx={{
        "padding": 1,
        "borderRadius": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
          {item.name}
        </Typography>

        {(item.quantity ?? 1) > 1 && (
          <Chip
            label={`×${item.quantity ?? 1}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}

        <Typography>
          <Nuyen amount={item.cost} />
        </Typography>

        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <RiDeleteBin6Line size={16} />
        </IconButton>
      </Stack>

      {(availability || source || description) && (
        <Stack direction="row" gap={1} sx={{ pt: 1 }} flexWrap="wrap">
          {availability && (
            <AvailabilityChip
              availability={availability}
              color={
                availability.rating > GearMaxAvailability
                  ? "warning"
                  : undefined
              }
            />
          )}

          {source && (
            <Chip
              label={`${source.book} p.${source.page}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ flexGrow: 1, alignSelf: "center" }}
            >
              {description}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  )
}
