import Stack from "@mui/material/Stack"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import type { FC, ReactNode } from "react"

export interface EntityCardLayoutFooterRowProps {
  children: ReactNode
}

/** Bottom layout region of an EntityCard — source, availability, cost, and similar metadata. */
export const EntityCardLayoutFooterRow: FC<EntityCardLayoutFooterRowProps> = ({ children }) => (
  <Stack
    direction="row"
    sx={{
      paddingX: 1,
      paddingY: 0.75,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 0.5,
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
    }}
  >
    {children}
  </Stack>
)

EntityCardLayoutFooterRow.displayName = "EntityCard.Layout.FooterRow"
