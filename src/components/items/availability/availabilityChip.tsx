import type { ChipProps } from "@mui/material/Chip"
import type { FC } from "react"

import { StatChip } from "#/components/ui/statChip.tsx"
import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import { availabilityToString } from "#/system/availabilityInfo.ts"

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
