import Typography from "@mui/material/Typography"
import type { AriaAttributes, FC, ReactNode } from "react"

interface ItemCardTitleProps extends AriaAttributes {
  children: ReactNode
}

export const ItemCardTitle: FC<ItemCardTitleProps> = ({ children, ...aria }) => (
  <Typography component="div" sx={{ flexGrow: 1 }}{...aria}>
    {children}
  </Typography>
)
