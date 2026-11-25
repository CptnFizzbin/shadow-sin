import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { formatNuyen } from "#/components/ui/nuyen.tsx"

export interface ItemDetailsCostProps {
  value: number | undefined
}

/** Overrides `item.cost` in the meta line `ItemDetailsRoot` renders by default. */
export const ItemDetailsCost: FC<ItemDetailsCostProps> = ({ value }) => {
  if (value === undefined) return null
  return <Typography>{formatNuyen(value)}</Typography>
}

ItemDetailsCost.displayName = "ItemDetails.Cost"
