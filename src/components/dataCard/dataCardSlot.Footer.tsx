import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

interface DataCardFooterProps {
  children: ReactNode
}

/**
 * Bottom slot for supplementary content that doesn't fit Stat/Subitem/Source/
 * DamageTrack — e.g. cost, quantity, or inline actions carried over from a
 * legacy card being adapted onto this architecture. The root renders this
 * alongside Source inside the footer band, so this slot only owns its own
 * content layout, not the band's border/background.
 */
export const DataCardSlotFooter: FC<DataCardFooterProps> = ({ children }) => (
  <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
    {children}
  </Stack>
)

DataCardSlotFooter.displayName = "DataCard.Footer"
