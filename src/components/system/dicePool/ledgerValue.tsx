import type { TypographyProps } from "@mui/material/Typography"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

/** A value in the dice pool ledger's left-hand column: fixed width and right-aligned so numbers line up. */
export const LedgerValue: FC<TypographyProps> = ({ sx, ...props }) => (
  <Typography
    {...props}
    sx={[
      { flexShrink: 0, minWidth: "2.5ch", textAlign: "right", fontVariantNumeric: "tabular-nums", lineHeight: "inherit" },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
)
