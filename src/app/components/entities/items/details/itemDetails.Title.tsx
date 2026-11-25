import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

export interface ItemDetailsTitleProps {
  title: ReactNode
}

/** Overrides the item name `ItemDetailsRoot` renders by default. */
export const ItemDetailsTitle: FC<ItemDetailsTitleProps> = ({ title }) => (
  <Typography variant="h1">{title}</Typography>
)

ItemDetailsTitle.displayName = "ItemDetails.Title"
