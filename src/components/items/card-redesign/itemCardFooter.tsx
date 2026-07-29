import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

interface ItemCardFooterProps {
  children: ReactNode
}

/**
 * Full-width bottom slot for supplementary content that doesn't fit Stat/Subitem/
 * Source/DamageTrack — e.g. cost, quantity, or inline actions carried over from a
 * legacy card being adapted onto this architecture.
 */
export const ItemCardFooter: FC<ItemCardFooterProps> = ({ children }) => (
  <Stack
    direction="row"
    sx={{
      width: "100%",
      gap: 1,
      alignItems: "center",
      flexWrap: "wrap",
      borderTop: "1px solid",
      borderColor: "divider",
      pt: 0.5,
      mt: 0.5,
    }}
  >
    {children}
  </Stack>
)

ItemCardFooter.displayName = "ItemCard.Footer"
