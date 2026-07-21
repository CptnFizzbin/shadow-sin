import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DamageTrackCell, getWoundModifierLabel } from "./damageTrack.tsx"

interface InlineDamageTrackProps {
  label?: string
  max: number
  current: number
  onChange: (value: number) => void
  woundInterval?: number
}

/**
 * Compact damage track for contexts too tight for the full DamageTrack
 * (e.g. an item card). Reuses DamageTrack's own cell and wound-modifier
 * marking for visual consistency, laid out on a fixed 10-column grid on
 * its own row below the label so cells stay uniformly sized (and
 * tappable) regardless of how many boxes are in a partial row; extra
 * boxes wrap onto additional rows automatically.
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gridAutoRows: "32px",
          gap: 0.5,
        }}
      >
        {Array.from({ length: max }, (_, index) => index + 1).map((value) => (
          <DamageTrackCell key={value} filled={value <= current} onClick={() => toggleCell(value)}>
            {getWoundModifierLabel(value, woundInterval)}
          </DamageTrackCell>
        ))}
      </Box>
    </Stack>
  )
}
