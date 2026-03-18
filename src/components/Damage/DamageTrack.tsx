import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { Label } from "#/components/UI/Text/Label.tsx"

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
              toggleCell={(value) => {
                if (value === current) {
                  onChange(value - 1)
                } else {
                  onChange(value)
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
      <Box sx={{ textAlign: "right", width: "100%" }}>
        {value % 3 === 0 ? penalty * -1 : "\u00A0"}
      </Box>
    </TrackCell>
  )
}

interface TrackCellProps {
  children: React.ReactNode
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
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        minHeight: 38,
        border: "1px solid",
        borderColor: isOverflow ? "error.main" : "primary.dark",
        backgroundColor: filled ? "primary.main" : "background.paper",
        color: filled ? "primary.contrastText" : "text.primary",
        cursor: "pointer",
        transition: "background-color 0.15s ease, border-color 0.15s ease",
        "&:hover": {
          backgroundColor: filled ? "primary.main" : "primary.light",
          color: filled ? "primary.contrastText" : "common.black",
        },
      }}
    >
      {children}
    </Box>
  )
}
