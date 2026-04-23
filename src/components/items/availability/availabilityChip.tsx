import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import type { FC } from "react"

import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import { availabilityToString } from "#/system/availabilityInfo.ts"

export interface AvailabilityChipProps extends Omit<ChipProps, "label"> {
  availability: AvailabilityInfo
}

export const AvailabilityChip: FC<AvailabilityChipProps> = ({
  availability,
  ...props
}) => {
  const rating = availabilityToString(availability)

  if (availability.rating === 0) return null

  return (
    <Chip
      size="small"
      variant="outlined"
      sx={{ height: 20, fontSize: "0.7rem" }}
      {...props}
      label={`Avail: ${rating}`}
    />
  )
}
