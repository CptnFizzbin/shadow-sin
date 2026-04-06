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
}

export default function DamageTrack({
  label,
  max,
  current,
  onChange,
  allowOverflow,
}: DamageTrackProps) {
  let numCells = Math.max(max, current)
  if (allowOverflow && current >= max) {
    // Add an extra cell for overflow damage
    numCells += 1
  }

  return (
    <Stack gap={0.5}>
      <Label label={label} />

      <TrackCell onClick={() => onChange(0)}>0</TrackCell>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
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
  toggleCell: (newValue: number) => void
}

function DamageCell({
  value,
  filled,
  isOverflow,
  toggleCell,
}: DamageCellProps) {
  const penalty = Math.floor((value + 1) / 3)

  return (
    <TrackCell
      filled={filled}
      isOverflow={isOverflow}
      onClick={() => toggleCell(value)}
    >
      {value % 3 === 0 ? penalty * -1 : "\u00A0"}
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
