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
  const rowCount = Math.ceil(max / MAX_PER_ROW)

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
        {label} {current}/{max}
      </Typography>

      <Stack sx={{ gap: "2px" }}>
        {Array.from({ length: rowCount }, (_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${MAX_PER_ROW}, minmax(32px, 1fr))`,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {Array.from({ length: MAX_PER_ROW }, (__, colIndex) => {
              const value = rowIndex * MAX_PER_ROW + colIndex + 1
              // Every row renders all 10 slots (blank past `max`) so the right border always
              // lands on the true last column, instead of bleeding the last real box into it.
              const borderRight = colIndex === MAX_PER_ROW - 1 ? "none" : "1px solid"

              if (value > max) {
                return (
                  <Box
                    key={colIndex}
                    sx={(theme) => ({
                      height: 32,
                      borderRight,
                      borderColor: "divider",
                      background: `repeating-linear-gradient(45deg, transparent, transparent 4px, `
                        + `${theme.palette.divider} 4px, ${theme.palette.divider} 5px)`,
                    })}
                  />
                )
              }

              return (
                <ButtonBase
                  key={colIndex}
                  onClick={() => onChange(value === current ? value - 1 : value)}
                  sx={{
                    height: 32,
                    backgroundColor: value <= current ? fillColor : "transparent",
                    borderRight,
                    borderColor: "divider",
                  }}
                />
              )
            })}
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
