import Chip from "@mui/material/Chip"
import type { FC } from "react"

export interface ItemDetailsRatingProps {
  value: number | string | undefined
}

/** Sugar for a `Stat` block styled as a rating — kept separate so callers don't need to know that. */
export const ItemDetailsRating: FC<ItemDetailsRatingProps> = ({ value }) => {
  if (value === undefined) return null
  return <Chip size="small" label={`Rating ${value}`} />
}

ItemDetailsRating.displayName = "ItemDetails.Rating"
