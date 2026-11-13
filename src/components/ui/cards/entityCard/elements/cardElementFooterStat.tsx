import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

export interface CardElementFooterStatProps {
  label: string
  value: string | number | undefined
  /**
   * Overrides `value` for display when a modifier changes the stat's effective value (e.g. an
   * Implant grade's essence multiplier). When it differs from `value`, both render — `value`
   * struck through, `effectiveValue` beside it — matching `CardElementCost`.
   */
  effectiveValue?: string | number
}

/**
 * A cost-like stat shown as plain text in the card footer beside the item's nuyen cost (e.g. an
 * Implant's Essence cost), rather than as a chip in the stat row.
 */
export const CardElementFooterStat: FC<CardElementFooterStatProps> = ({ label, value, effectiveValue }) => {
  if (value === undefined) return null

  const isModified = effectiveValue !== undefined && effectiveValue !== value

  return (
    <Stack direction="row" sx={{ gap: 0.5, alignItems: "baseline" }}>
      {isModified && (
        <Typography
          component="span"
          sx={{ fontSize: "0.75rem", color: "text.disabled", textDecoration: "line-through" }}
        >
          {value}
        </Typography>
      )}
      <span>{`${isModified ? effectiveValue : value} ${label}`}</span>
    </Stack>
  )
}

CardElementFooterStat.displayName = "ItemCard.FooterStat"
