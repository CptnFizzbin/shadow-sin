import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"

export interface CardElementCostProps {
  value: number | undefined
  /**
   * Overrides `value` for display when a modifier changes what the item actually costs (e.g. an
   * Implant grade's nuyen multiplier). When it differs from `value`, both render — `value` struck
   * through, `effectiveValue` highlighted — rather than one silently overwriting the other.
   */
  effectiveValue?: number
}

export const CardElementCost: FC<CardElementCostProps> = ({ value, effectiveValue }) => {
  if (value === undefined) return null

  const isModified = effectiveValue !== undefined && effectiveValue !== value
  if (!isModified) return <Nuyen amount={effectiveValue ?? value} />

  return (
    <Stack direction="row" sx={{ gap: 0.5, alignItems: "baseline" }}>
      <Typography
        component="span"
        sx={{ fontSize: "0.75rem", color: "text.disabled", textDecoration: "line-through" }}
      >
        <Nuyen amount={value} />
      </Typography>
      <Nuyen amount={effectiveValue} />
    </Stack>
  )
}

CardElementCost.displayName = "ItemCard.Cost"
