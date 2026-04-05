import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { RatingChip } from "#/components/UI/rating-chip.tsx"
import type { SinData } from "#/lib/system/gear/sin-data.ts"

export interface SinCardSlots {
  trailingContent?: ReactNode
}

export interface SinCardProps {
  sin: SinData
  slots?: SinCardSlots
  onClick?: () => void
  onDelete?: () => void
  children?: ReactNode
}

export const SinCard: FC<SinCardProps> = ({
  sin,
  slots,
  onClick,
  onDelete,
  children,
}) => {
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        sx={{
          padding: 1,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          ...(onClick && {
            "cursor": "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }),
        }}
        onClick={onClick}
      >
        <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
          {sin.name}
        </Typography>

        {slots?.trailingContent}

        <RatingChip rating={sin.rating} />

        {onDelete && (
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <RiDeleteBin6Line size={16} />
          </IconButton>
        )}
      </Stack>

      {children && (
        <Stack
          gap={1}
          sx={{
            paddingTop: 1,
            paddingLeft: 1,
            paddingBottom: 1,
            borderLeft: "8px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {children}
        </Stack>
      )}
    </>
  )
}
