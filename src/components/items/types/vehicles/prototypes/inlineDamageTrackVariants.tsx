import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"

// PROTOTYPE — a few ideas for how the InlineDamageTrack itself should look
// and feel once dropped into a vehicle/drone card. All three still cap at
// 10 cells per row. See inlineDamageTrackPrototype.tsx for the switcher.

const MAX_PER_ROW = 10
const WOUND_INTERVAL = 3

interface VariantProps {
  label: string
  max: number
  current: number
  onChange: (value: number) => void
}

/** Variant A — the current InlineDamageTrack: numbered boxes, filled up through current. */
export const VariantNumberedBoxes: FC<VariantProps> = ({ label, max, current, onChange }) => (
  <InlineDamageTrack label={label} max={max} current={current} onChange={onChange} />
)

/** Variant B — blank checkboxes, grouped into wound-interval clusters like the full DamageTrack. */
export const VariantWoundTicks: FC<VariantProps> = ({ label, max, current, onChange }) => {
  const columns = Math.min(max, MAX_PER_ROW)

  const severityColor = current === 0
    ? "primary.main"
    : current / max >= 0.8
      ? "error.main"
      : current / max >= 0.5
        ? "warning.main"
        : "primary.main"

  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", whiteSpace: "nowrap" }}>
        {label} {current}/{max}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 0.5 }}>
        {Array.from({ length: max }, (_, index) => index + 1).map((value) => (
          <Box
            key={value}
            component="button"
            onClick={() => onChange(value === current ? value - 1 : value)}
            sx={{
              width: 16,
              height: 16,
              padding: 0,
              cursor: "pointer",
              border: "1px solid",
              borderColor: value <= current ? severityColor : "divider",
              backgroundColor: value <= current ? severityColor : "transparent",
              marginRight: value % WOUND_INTERVAL === 0 && value !== max ? 0.75 : 0,
            }}
          />
        ))}
      </Box>
    </Stack>
  )
}

/** Variant C — a single continuous fill bar, colour escalating as damage climbs toward max. */
export const VariantFillBar: FC<VariantProps> = ({ label, max, current, onChange }) => {
  const ratio = current / max
  const fillColor = ratio >= 0.8 ? "error.main" : ratio >= 0.5 ? "warning.main" : "primary.main"

  const rows: number[][] = []
  for (let start = 0; start < max; start += MAX_PER_ROW) {
    rows.push(Array.from({ length: Math.min(MAX_PER_ROW, max - start) }, (_, i) => start + i + 1))
  }

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
        {label} {current}/{max}
      </Typography>

      <Stack sx={{ gap: "2px" }}>
        {rows.map((row) => (
          <Box
            key={row[0]}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${MAX_PER_ROW}, minmax(32px, 1fr))`,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {row.map((value) => (
              <ButtonBase
                key={value}
                onClick={() => onChange(value === current ? value - 1 : value)}
                sx={{
                  "height": 32,
                  "backgroundColor": value <= current ? fillColor : "transparent",
                  "borderRight": "1px solid",
                  "borderColor": "divider",
                  "&:last-of-type": { borderRight: "none" },
                }}
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
