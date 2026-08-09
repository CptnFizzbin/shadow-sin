import type { StackProps } from "@mui/material/Stack"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

export interface HeaderRowProps extends StackProps {}

export const HeaderRight: FC<HeaderRowProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
)

HeaderRight.displayName = "Card.Layout.TopRight"
