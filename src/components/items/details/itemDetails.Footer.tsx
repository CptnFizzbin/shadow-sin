import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

interface ItemDetailsFooterProps {
  children: ReactNode
}

/**
 * Bottom slot for supplementary content that doesn't fit the other slots. Rendered after Effects
 * and before the cost/quantity/availability/source meta line.
 */
export const ItemDetailsFooter: FC<ItemDetailsFooterProps> = ({ children }) => (
  <Stack direction="row" sx={{ gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
    {children}
  </Stack>
)

ItemDetailsFooter.displayName = "ItemDetails.Footer"
