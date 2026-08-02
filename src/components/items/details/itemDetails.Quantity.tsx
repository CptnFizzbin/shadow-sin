import Typography from "@mui/material/Typography"
import type { FC } from "react"

export interface ItemDetailsQuantityProps {
  value: number | undefined
}

/** Overrides `item.quantity` in the meta line `ItemDetailsRoot` renders by default. */
export const ItemDetailsQuantity: FC<ItemDetailsQuantityProps> = ({ value }) => {
  if (value === undefined) return null
  return <Typography>Qty: {value}</Typography>
}

ItemDetailsQuantity.displayName = "ItemDetails.Quantity"
