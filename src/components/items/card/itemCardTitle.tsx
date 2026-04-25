import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

interface ItemCardTitleProps {
  children: ReactNode
}

export const ItemCardTitle: FC<ItemCardTitleProps> = ({ children }) => (
  <Typography sx={{ flexGrow: 1 }}>{children}</Typography>
)
