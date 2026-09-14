import type { FC } from "react"

import { AvailabilityChip } from "#/components/entities/items/availability/availabilityChip.tsx"
import type { AvailabilityInfo } from "#/system/model/items/availabilityInfo.ts"

export interface ItemDetailsAvailabilityProps {
  value: AvailabilityInfo | undefined
}

/** Overrides `item.availability` in the meta line `ItemDetailsRoot` renders by default. */
export const ItemDetailsAvailability: FC<ItemDetailsAvailabilityProps> = ({ value }) => {
  if (!value) return null
  return <AvailabilityChip availability={value} />
}

ItemDetailsAvailability.displayName = "ItemDetails.Availability"
