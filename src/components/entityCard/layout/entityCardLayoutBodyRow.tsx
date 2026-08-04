import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

export interface EntityCardLayoutBodyRowProps {
  children: ReactNode
}

/** Middle layout region of an EntityCard — stats, damage tracks, subitems, etc. */
export const EntityCardLayoutBodyRow: FC<EntityCardLayoutBodyRowProps> = ({ children }) => (
  <Stack sx={{ padding: 1, gap: 0.5 }}>{children}</Stack>
)

EntityCardLayoutBodyRow.displayName = "EntityCard.Layout.BodyRow"
