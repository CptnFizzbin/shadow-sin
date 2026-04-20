import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import type { FC } from "react"

import type { AvailablityInfo } from "#/system/availablityInfo.ts"
import { availabilityToString } from "#/system/availablityInfo.ts"

export interface AvailabilityChipProps extends Omit<ChipProps, "label"> {
  availability: AvailablityInfo
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
