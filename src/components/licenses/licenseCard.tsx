import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { RatingChip } from "#/components/ui/ratingChip.tsx"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"

export interface LicenseCardSlots {
  trailingContent?: ReactNode
}

export interface LicenseCardProps {
  license: LicenseData
  slots?: LicenseCardSlots
  onClick?: () => void
  onDelete?: () => void
}

export const LicenseCard: FC<LicenseCardProps> = ({
  license,
  slots,
  onClick,
  onDelete,
}) => {
  return (
    <Stack
      direction="row"
      onClick={onClick}
      sx={{ alignItems: "center", gap: 1, paddingRight: 1, ...(onClick && {
        "cursor": "pointer",
        "borderRadius": 1,
        "&:hover": { bgcolor: "action.hover" },
      }) }}
    >
      <Typography sx={{ flexGrow: 1 }}>
        {license.name}
      </Typography>

      {slots?.trailingContent}

      <RatingChip rating={license.rating} />

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
  )
}
