import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"
import { Children } from "react"

export interface DataCardContentProps {
  children: ReactNode
}

/**
 * Freeform block below the card's main body/footer bands, for content too
 * large or irregular for a Stat chip or Footer row (e.g. a spirit's
 * skills/powers/attributes). Rendered only when it has children.
 */
export const DataCardSlotContent: FC<DataCardContentProps> = ({ children }) => {
  const childArray = Children.toArray(children)
  if (childArray.length === 0) return null

  return (
    <Stack sx={{ gap: 0, padding: 1 }}>
      {childArray}
    </Stack>
  )
}

DataCardSlotContent.displayName = "DataCard.Content"
