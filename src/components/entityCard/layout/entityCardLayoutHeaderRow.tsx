import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import type { FC, ReactNode } from "react"

export interface EntityCardLayoutHeaderRowProps {
  children: ReactNode
}

/** Top layout region of an EntityCard — title/type on the left, status icons on the right. */
export const EntityCardLayoutHeaderRow: FC<EntityCardLayoutHeaderRowProps> = ({ children }) => (
  <Stack
    direction="row"
    sx={{
      paddingX: 1,
      paddingY: 0.75,
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 0.5,
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
    }}
  >
    {children}
  </Stack>
)

EntityCardLayoutHeaderRow.displayName = "EntityCard.Layout.HeaderRow"
