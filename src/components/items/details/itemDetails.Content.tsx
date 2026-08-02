import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"
import { Children } from "react"

export interface ItemDetailsContentProps {
  children: ReactNode
}

/**
 * Freeform block for content too large or irregular for a `Stat` block or
 * `Footer` row. Rendered only when it has children.
 */
export const ItemDetailsContent: FC<ItemDetailsContentProps> = ({ children }) => {
  const childArray = Children.toArray(children)
  if (childArray.length === 0) return null

  return (
    <Stack sx={{ gap: 1 }}>
      {childArray}
    </Stack>
  )
}

ItemDetailsContent.displayName = "ItemDetails.Content"
