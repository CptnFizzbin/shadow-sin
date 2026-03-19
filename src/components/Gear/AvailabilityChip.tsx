import Chip from "@mui/material/Chip"
import type { FC } from "react"
import {
  type AvailablityInfo,
  availabilityToString,
} from "#/lib/system/types/availablityInfo.ts"

export const AvailabilityChip: FC<AvailablityInfo> = (availability) => {
  const rating = availabilityToString(availability)

  return (
    <Chip
      label={`Avail: ${rating}`}
      size="small"
      variant="outlined"
      sx={{ height: 20, fontSize: "0.7rem" }}
    />
  )
}
