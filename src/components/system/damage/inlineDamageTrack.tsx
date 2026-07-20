import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

const MAX_BOXES_PER_ROW = 10

interface InlineDamageTrackProps {
  label?: string
  max: number
  current: number
  onChange: (value: number) => void
}

/**
 * Compact, single-line damage track for contexts too tight for the full
 * DamageTrack (e.g. an item card). Mirrors the edge tracker's grid-of-cells
 * interaction, wrapping onto additional rows past 10 boxes.
 */
export const InlineDamageTrack: FC<InlineDamageTrackProps> = ({ label, max, current, onChange }) => {
  const columns = Math.min(max, MAX_BOXES_PER_ROW)

  const toggleCell = (value: number) => {
    onChange(value === current ? value - 1 : value)
  }

  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {label && (
        <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", whiteSpace: "nowrap" }}>
          {label} {current}/{max}
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 0.5,
        }}
      >
        {Array.from({ length: max }, (_, index) => index + 1).map((value) => (
          <Button
            key={value}
            variant={value <= current ? "contained" : "outlined"}
            onClick={(event) => {
              toggleCell(value)
              event.currentTarget.blur()
            }}
            sx={{ minWidth: 0, width: 20, height: 20, padding: 0, fontSize: "0.6rem" }}
          >
            {value}
          </Button>
        ))}
      </Box>
    </Stack>
  )
}
