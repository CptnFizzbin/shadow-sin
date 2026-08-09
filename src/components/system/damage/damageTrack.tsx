import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { SxProps, Theme } from "@mui/material/styles"
import type { ReactNode } from "react"

import { Label } from "#/components/ui/text/label.tsx"

interface DamageTrackProps {
  label: string
  max: number
  current: number
  onChange: (value: number) => void
  allowOverflow?: boolean
  woundInterval?: number
  /**
   * Number of grid columns to lay cells out in. Defaults to `woundInterval`,
   * which groups cells into rows that line up with wound markers. Pass this
   * explicitly when `woundInterval` doesn't reflect a sensible row width
   * (e.g. it's been inflated to suppress markers), so cells still wrap
   * instead of being squeezed below their minimum width.
   */
  columns?: number
}

export default function DamageTrack({
  label,
  max,
  current,
  onChange,
  allowOverflow,
  woundInterval = 3,
  columns,
}: DamageTrackProps) {
  let numCells = Math.max(max, current)
  if (allowOverflow && current >= max) {
    numCells += 1
  }

  return (
    <Stack sx={{ maxWidth: 200, flexGrow: 1 }}>
      <Label label={label} />

      <Stack sx={{ gap: 0.5 }}>
        <DamageTrackCell onClick={() => onChange(0)}>Reset</DamageTrackCell>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns ?? woundInterval}, 1fr)`,
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
  return (
    <DamageTrackCell
      filled={filled}
      isOverflow={isOverflow}
      onClick={() => toggleCell(value)}
    >
      {getWoundModifierLabel(value, woundInterval)}
    </DamageTrackCell>
  )
}

/** The wound penalty a cell marks (e.g. -1 every 3rd box), or a blank cell to keep cells uniform size. */
export function getWoundModifierLabel(value: number, woundInterval: number): ReactNode {
  const isWoundMarker = value > 0 && value % woundInterval === 0
  if (!isWoundMarker) return <>&nbsp;</>

  const penalty = Math.floor(value / woundInterval)
  return penalty * -1
}

interface DamageTrackCellProps {
  children: ReactNode
  onClick: () => void
  filled?: boolean
  isOverflow?: boolean
  /** Merged on top of the cell's own sizing — e.g. InlineDamageTrack's fixed width/height for flex-wrap layout. */
  sx?: SxProps<Theme>
}

export function DamageTrackCell({
  children,
  onClick,
  filled = false,
  isOverflow = false,
  sx,
}: DamageTrackCellProps) {
  return (
    <Button
      variant={filled ? "contained" : "outlined"}
      color={isOverflow ? "error" : "primary"}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
        e.currentTarget.blur()
      }}
      sx={[{ textAlign: "right", minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Button>
  )
}
