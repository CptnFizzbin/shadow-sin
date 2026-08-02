import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"

export interface DataCardCostProps {
  value: number | undefined
}

export const DataCardSlotCost: FC<DataCardCostProps> = ({ value }) => {
  if (value === undefined) return null
  return <Nuyen amount={value} />
}

DataCardSlotCost.displayName = "DataCard.Cost"
