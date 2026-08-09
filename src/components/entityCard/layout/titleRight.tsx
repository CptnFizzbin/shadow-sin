import type { StackProps } from "@mui/material/Stack"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

export interface TitleRightProps extends StackProps {}

export const TitleRight: FC<TitleRightProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
)

TitleRight.displayName = "Card.Layout.TitleRight"
