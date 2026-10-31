import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { RatingModifier } from "#/system/formulas/ratings/ratingFormulas.ts"

interface DiceGroupModifierRowProps {
  modifier: RatingModifier
}

/** One modifier under a dice group in the pool ledger — already counted in the group's size, so shown muted and signed. */
export const DiceGroupModifierRow: FC<DiceGroupModifierRowProps> = ({ modifier }) => (
  <Stack direction="row" sx={{ justifyContent: "space-between", paddingLeft: 1.5, color: "text.secondary" }}>
    <Typography variant="caption">{modifier.name}</Typography>
    <Typography variant="caption" sx={{ fontVariantNumeric: "tabular-nums" }}>
      {modifier.value > 0 ? `+${modifier.value}` : modifier.value}
    </Typography>
  </Stack>
)
