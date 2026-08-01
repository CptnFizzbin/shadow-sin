import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { DataCardStatProps } from "./dataCardSlot.Stat.tsx"
import { DataCardSlotStat } from "./dataCardSlot.Stat.tsx"

export interface DataCardSubitemStat extends Omit<DataCardStatProps, "value"> {
  value: string
}

export interface DataCardSubitemProps {
  name: string
  /** By convention capped at 2 entries for a clean single line; not enforced. */
  stats?: DataCardSubitemStat[]
}

/** Single-line child-item row (accessories, programs, mods, equipment). */
export const DataCardSlotSubitem: FC<DataCardSubitemProps> = ({ name, stats = [] }) => (
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
      {stats.map((stat, index) => <DataCardSlotStat key={index} {...stat} />)}
    </Stack>
  </Stack>
)

DataCardSlotSubitem.displayName = "DataCard.Subitem"
