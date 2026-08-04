import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

export interface CardElementBodyProps {
  children: ReactNode
}

/** Middle layout region of an EntityCard — stats, damage tracks, subitems, etc. */
export const CardElementBody: FC<CardElementBodyProps> = ({ children }) => (
  <Stack sx={{ padding: 1, gap: 1 }}>{children}</Stack>
)

CardElementBody.displayName = "EntityCard.Layout.Body"
