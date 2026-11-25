import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC, PropsWithChildren, ReactNode } from "react"

export interface CardElementPowerListProps extends PropsWithChildren {
  label?: ReactNode
}

/**
 * Labeled, wrapping row for a list of power chips (e.g. `CritterPowerChip`). Takes rendered chips
 * as `children` rather than raw power data — a power's own tooltip/dialog behavior belongs to the
 * chip component, not this layout element.
 */
export const CardElementPowerList: FC<CardElementPowerListProps> = ({ label = "Powers", children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
      {label}
    </Typography>
    <Stack direction="row" sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
      {children}
    </Stack>
  </Box>
)

CardElementPowerList.displayName = "SpiritCard.PowerList"
