import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"

export interface CardElementCostProps {
  value: number | undefined
}

export const CardElementCost: FC<CardElementCostProps> = ({ value }) => {
  if (value === undefined) return null
  return <Nuyen amount={value} />
}

CardElementCost.displayName = "EntityCard.Cost"
