import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { CardElementStatProps } from "./cardElementStat.tsx"
import { CardElementStat } from "./cardElementStat.tsx"

export interface CardElementSubitemStat extends Omit<CardElementStatProps, "value"> {
  value: string | number
}

export interface CardElementSubitemProps {
  name: string
  /** By convention capped at 2 entries for a clean single line; not enforced. */
  stats?: CardElementSubitemStat[]
}

/** Single-line child-item row (accessories, programs, mods, equipment). */
export const CardElementSubitem: FC<CardElementSubitemProps> = ({ name, stats = [] }) => (
  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5, py: 0.25, minWidth: 0 }}>
    <Typography
      sx={{
        fontSize: "0.8rem",
        flexGrow: 1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </Typography>

    <Stack direction="row" sx={{ gap: 0.5, flexShrink: 0 }}>
      {stats.map((stat, index) => <CardElementStat key={index} {...stat} />)}
    </Stack>
  </Stack>
)

CardElementSubitem.displayName = "ItemCard.Subitem"
