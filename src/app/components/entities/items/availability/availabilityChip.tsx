import type { ChipProps } from "@mui/material/Chip"
import type { FC } from "react"

import type { AvailabilityInfo } from "#/data/items/availabilityInfo.ts"
import { availabilityToString } from "#/data/items/availabilityInfo.ts"
import { StatChip } from "#/ui/chips/statChip.tsx"

interface AvailabilityChipProps extends Omit<ChipProps, "label"> {
  availability: AvailabilityInfo
}

export const AvailabilityChip: FC<AvailabilityChipProps> = ({
  availability,
  ...props
}) => {
  const rating = availabilityToString(availability)

  if (availability.rating === 0) return null

  return <StatChip size="small" label={`Avail: ${rating}`} {...props} />
}
