import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

interface ItemCardSourceProps {
  children?: ReactNode
}

/** Source/book reference slot. Renders nothing when there's no source to show. */
export const ItemCardSource: FC<ItemCardSourceProps> = ({ children }) => {
  if (!children) return null

  return (
    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", whiteSpace: "nowrap" }}>
      {children}
    </Typography>
  )
}

ItemCardSource.displayName = "ItemCard.Source"
