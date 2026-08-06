import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"

export interface CardElementAvailabilityProps {
  value: AvailabilityInfo | undefined
}

export const CardElementAvailability: FC<CardElementAvailabilityProps> = ({ value }) => {
  if (!value) return null
  return <AvailabilityChip availability={value} />
}

CardElementAvailability.displayName = "ItemCard.Availability"
