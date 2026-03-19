import Chip from "@mui/material/Chip"
import type { FC } from "react"
import {
  type AvailablityInfo,
  availabilityToString,
} from "#/lib/system/types/availablityInfo.ts"

export interface AvailabilityChipProps {
  availability: AvailablityInfo
}

export const AvailabilityChip: FC<AvailabilityChipProps> = ({
  availability,
}) => {
  const rating = availabilityToString(availability)

  if (availability.rating === 0) return null

  return (
    <Chip
      label={`Avail: ${rating}`}
      size="small"
      variant="outlined"
      sx={{ height: 20, fontSize: "0.7rem" }}
    />
  )
}
