import type { StackProps } from "@mui/material/Stack"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

export interface FooterRightProps extends StackProps {}

export const FooterRight: FC<FooterRightProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
)

FooterRight.displayName = "Card.Layout.FooterRight"
