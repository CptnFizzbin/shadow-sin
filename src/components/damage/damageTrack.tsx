import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { ReactNode } from "react"

import { Label } from "#/components/ui/text/label.tsx"

interface DamageTrackProps {
  label: string
  max: number
  current: number
  onChange: (value: number) => void
  allowOverflow?: boolean
  woundInterval?: number
}

export default function DamageTrack({
  label,
  max,
  current,
  onChange,
  allowOverflow,
  woundInterval = 3,
}: DamageTrackProps) {
  let numCells = Math.max(max, current)
  if (allowOverflow && current >= max) {
    // Add an extra cell for overflow damage
    numCells += 1
  }

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label={label} />

      <TrackCell onClick={() => onChange(0)}>Reset</TrackCell>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${woundInterval}, 1fr)`,
          gap: 0.5,
        }}
      >
        {Array.from({ length: numCells }, (_, offset) => offset + 1).map(
          (value) => (
            <DamageCell
              key={`${label}-${value}`}
              value={value}
              filled={value <= current}
              isOverflow={value > max}
              woundInterval={woundInterval}
              toggleCell={(newValue) => {
                if (newValue === current) {
                  onChange(newValue - 1)
                } else {
                  onChange(newValue)
                }
              }}
            />
          ),
        )}
      </Box>
    </Stack>
  )
}

interface DamageCellProps {
  value: number
  filled: boolean
  isOverflow: boolean
  woundInterval: number
  toggleCell: (newValue: number) => void
}

function DamageCell({
  value,
  filled,
  isOverflow,
  woundInterval,
  toggleCell,
}: DamageCellProps) {
  const isWoundMarker = value > 0 && value % woundInterval === 0
  const penalty = Math.floor(value / woundInterval)

  return (
    <TrackCell
      filled={filled}
      isOverflow={isOverflow}
      onClick={() => toggleCell(value)}
    >
      {/* Use non-breaking space to keep cells uniform size when empty */}
      {isWoundMarker ? penalty * -1 : <>&nbsp;</>}
    </TrackCell>
  )
}

interface TrackCellProps {
  children: ReactNode
  onClick: () => void
  filled?: boolean
  isOverflow?: boolean
}

function TrackCell({
  children,
  onClick,
  filled = false,
  isOverflow = false,
}: TrackCellProps) {
  return (
    <Button
      variant={filled ? "contained" : "outlined"}
      color={isOverflow ? "error" : "primary"}
      onClick={(e) => {
        onClick()
        e.currentTarget.blur()
      }}
      sx={{ textAlign: "right", minWidth: 0 }}
    >
      {children}
    </Button>
  )
}
