import type { StackProps } from "@mui/material/Stack"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

export interface FooterLeftProps extends StackProps {}

export const FooterLeft: FC<FooterLeftProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
)

FooterLeft.displayName = "Card.Layout.FooterLeft"
