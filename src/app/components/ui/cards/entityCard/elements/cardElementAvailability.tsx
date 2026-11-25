import type { FC } from "react"

import type { AvailabilityInfo } from "#data/items/availabilityInfo.ts"
import { availabilityToString } from "#data/items/availabilityInfo.ts"

export interface CardElementAvailabilityProps {
  value: AvailabilityInfo | undefined
}

/** Inline availability text (e.g. `14R`); renders nothing when there's no availability rating. */
export const CardElementAvailability: FC<CardElementAvailabilityProps> = ({ value }) => {
  if (!value || value.rating === 0) return null
  return <span>{availabilityToString(value)}</span>
}

CardElementAvailability.displayName = "ItemCard.Availability"
