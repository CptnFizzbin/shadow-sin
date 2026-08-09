import type { StackProps } from "@mui/material/Stack"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

export interface HeaderRowProps extends StackProps {}

/** Top layout region of an EntityCard — title/type on the left, status icons on the right. */
export const HeaderRow: FC<HeaderRowProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
)

HeaderRow.displayName = "Card.Layout.HeaderRow"
