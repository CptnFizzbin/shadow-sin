import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DamageTrackCell, getWoundModifierLabel } from "./damageTrack.tsx"

export interface InlineDamageTrackProps {
  label?: string
  max: number
  current: number
  onChange: (value: number) => void
  woundInterval?: number
}

/**
 * Compact damage track for contexts too tight for the full DamageTrack
 * (e.g. an item card). Reuses DamageTrack's own cell and wound-modifier
 * marking for visual consistency, laid out as a fixed-size, wrapping flex
 * row so cells stay uniformly sized (and tappable) regardless of the
 * container's width — a card narrow enough to only fit a few cells per
 * row (e.g. two tracks side by side) wraps onto more rows instead of
 * squeezing cells down or overflowing the card.
 */
export const InlineDamageTrack: FC<InlineDamageTrackProps> = ({
  label,
  max,
  current,
  onChange,
  woundInterval = 3,
}) => {
  const toggleCell = (value: number) => {
    onChange(value === current ? value - 1 : value)
  }

  return (
    <Stack sx={{ gap: 0.5 }}>
      {label && (
        <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
          {label} {current}/{max}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {Array.from({ length: max }, (_, index) => index + 1).map((value) => (
          <DamageTrackCell
            key={value}
            filled={value <= current}
            onClick={() => toggleCell(value)}
            sx={{ width: 32, height: 32, flexShrink: 0 }}
          >
            {getWoundModifierLabel(value, woundInterval)}
          </DamageTrackCell>
        ))}
      </Box>
    </Stack>
  )
}
