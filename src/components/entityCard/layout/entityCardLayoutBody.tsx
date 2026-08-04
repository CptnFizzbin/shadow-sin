import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

export interface EntityCardLayoutBodyProps {
  children: ReactNode
}

/** Middle layout region of an EntityCard — stats, damage tracks, subitems, etc. */
export const EntityCardLayoutBody: FC<EntityCardLayoutBodyProps> = ({ children }) => (
  <Stack sx={{ padding: 1, gap: 1 }}>{children}</Stack>
)

EntityCardLayoutBody.displayName = "EntityCard.Layout.Body"
