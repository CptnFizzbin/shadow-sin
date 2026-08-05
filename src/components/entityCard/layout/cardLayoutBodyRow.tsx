import type { StackProps } from "@mui/material/Stack"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

export interface BodyRowProps extends StackProps {}

/** Middle layout region of an EntityCard — stats, damage tracks, subitems, etc. */
export const CardLayoutBodyRow: FC<BodyRowProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
)

CardLayoutBodyRow.displayName = "Card.Layout.BodyRow"
