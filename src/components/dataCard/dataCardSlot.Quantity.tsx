import type { FC } from "react"

import { StatChip } from "#/components/ui/statChip.tsx"

export interface DataCardQuantityProps {
  value: number | undefined
}

/** Only shown when there's more than one of the item. */
export const DataCardSlotQuantity: FC<DataCardQuantityProps> = ({ value }) => {
  if (value === undefined || value <= 1) return null
  return <StatChip label={`x${value}`} />
}

DataCardSlotQuantity.displayName = "DataCard.Quantity"
