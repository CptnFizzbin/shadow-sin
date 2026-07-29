import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ItemCardStatProps } from "./itemCardStat.tsx"
import { ItemCardStat } from "./itemCardStat.tsx"

export interface ItemCardSubitemStat extends Omit<ItemCardStatProps, "value"> {
  value: string
}

export interface ItemCardSubitemProps {
  name: string
  /** By convention capped at 2 entries for a clean single line; not enforced. */
  stats?: ItemCardSubitemStat[]
}

/** Single-line child-item row (accessories, programs, mods, equipment). */
export const ItemCardSubitem: FC<ItemCardSubitemProps> = ({ name, stats = [] }) => (
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
      {stats.map((stat, index) => <ItemCardStat key={index} {...stat} />)}
    </Stack>
  </Stack>
)

ItemCardSubitem.displayName = "ItemCard.Subitem"
