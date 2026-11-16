import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { RatingBreakdown } from "#/system/formulas/ratings/ratingFormulas.ts"

import { LedgerValue } from "./ledgerValue.tsx"

interface DiceGroupBreakdownProps {
  breakdown: RatingBreakdown
}

interface BreakdownItem {
  name: string
  value: string
  overridden?: boolean
}

/**
 * The Raw Value, then each Modifier: signed, except the Augmented Maximum cap, which shows the
 * total it caps to (`=7`). An overridden Modifier is listed but doesn't count toward that total.
 */
const toItems = ({ rawValue, modifiers }: RatingBreakdown): BreakdownItem[] => {
  let runningTotal = rawValue
  return [
    { name: "Raw Value", value: String(rawValue) },
    ...modifiers.map((modifier) => {
      if (!modifier.overridden) runningTotal += modifier.value
      const value = modifier.isCap
        ? `=${runningTotal}`
        : modifier.value > 0 ? `+${modifier.value}` : String(modifier.value)
      return { name: modifier.name, value, overridden: modifier.overridden }
    }),
  ]
}

/**
 * A dice group's {@link RatingBreakdown} as a compact indented list under the group's row, values
 * first, with overridden Modifiers struck through. The group's size already includes the rest.
 */
export const DiceGroupBreakdown: FC<DiceGroupBreakdownProps> = ({ breakdown }) => (
  <Stack component="ul" sx={{ gap: 0, margin: 0, paddingLeft: 2, listStyle: "none", color: "text.secondary" }}>
    {toItems(breakdown).map((item, index) => (
      <Stack
        key={`${index}:${item.name}`}
        component="li"
        direction="row"
        title={item.overridden ? "Overridden — a larger bonus it doesn't stack with applies instead" : undefined}
        sx={{
          gap: 1,
          lineHeight: 1.25,
          ...(item.overridden && { textDecoration: "line-through", color: "text.disabled" }),
        }}
      >
        <LedgerValue variant="caption">{item.value}</LedgerValue>
        <Typography variant="caption" sx={{ lineHeight: "inherit" }}>{item.name}</Typography>
      </Stack>
    ))}
  </Stack>
)
