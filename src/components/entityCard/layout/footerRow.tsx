import type { StackProps } from "@mui/material/Stack"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

export interface FooterRowProps extends StackProps {}

/** Bottom layout region of an EntityCard — source, availability, cost, and similar metadata. */
export const FooterRow: FC<FooterRowProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
)

FooterRow.displayName = "EntityCard.Layout.FooterRow"
