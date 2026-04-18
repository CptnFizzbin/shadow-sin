import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiSubtractLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { Label } from "#/components/ui/text/label.tsx"

export interface CounterProps {
  value: number
  min: number
  max: number
  onChange: (newValue: number) => void
  label?: string
  unit?: ReactNode
}

export const Counter: FC<CounterProps> = ({ value, min, max, onChange, label, unit }) => {
  return (
    <Stack alignItems="center" gap={0} flexGrow={1}>
      {label && <Label label={label} />}

      <Stack direction="row" alignItems="center">
        <IconButton
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <RiSubtractLine />
        </IconButton>
        <Stack direction="row" alignItems="center" gap={0.5} minWidth={50} justifyContent="center">
          <Typography>{value} {max >= 1 && <>/ {max}</>}</Typography>
          {unit}
        </Stack>
        <IconButton
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <RiAddLine />
        </IconButton>
      </Stack>
    </Stack>
  )
}
