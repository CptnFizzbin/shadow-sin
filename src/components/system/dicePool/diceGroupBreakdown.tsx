import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { RatingBreakdown } from "#/system/formulas/ratings/ratingFormulas.ts"

interface DiceGroupBreakdownProps {
  breakdown: RatingBreakdown
}

const formatModifier = (value: number): string => value > 0 ? `+${value}` : String(value)

/**
 * A dice group's {@link RatingBreakdown} as an indented list under the group's row: its Raw Value,
 * then each Modifier. The group's size already includes all of them.
 */
export const DiceGroupBreakdown: FC<DiceGroupBreakdownProps> = ({ breakdown }) => {
  const items = [
    { name: "Raw Value", value: String(breakdown.rawValue) },
    ...breakdown.modifiers.map((modifier) => ({ name: modifier.name, value: formatModifier(modifier.value) })),
  ]

  return (
    <Stack component="ul" sx={{ margin: 0, paddingLeft: 1.5, listStyle: "none", color: "text.secondary" }}>
      {items.map((item, index) => (
        <Stack key={`${index}:${item.name}`} component="li" direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="caption">{item.name}</Typography>
          <Typography variant="caption" sx={{ fontVariantNumeric: "tabular-nums" }}>{item.value}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}
