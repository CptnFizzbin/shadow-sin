import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

interface ItemCardTitleProps {
  children: ReactNode
}

export const ItemCardTitle: FC<ItemCardTitleProps> = ({ children }) => (
  <Typography component="div" sx={{ flexGrow: 1 }}>{children}</Typography>
)
