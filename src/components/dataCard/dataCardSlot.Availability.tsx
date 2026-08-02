import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"

export interface DataCardAvailabilityProps {
  value: AvailabilityInfo | undefined
}

export const DataCardSlotAvailability: FC<DataCardAvailabilityProps> = ({ value }) => {
  if (!value) return null
  return <AvailabilityChip availability={value} />
}

DataCardSlotAvailability.displayName = "DataCard.Availability"
