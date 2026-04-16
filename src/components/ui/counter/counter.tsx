import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiSubtractLine } from "@remixicon/react"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"

export interface CounterProps {
  value: number
  min: number
  max: number
  onChange: (newValue: number) => void
  label?: string
}

export const Counter: FC<CounterProps> = ({ value, min, max, onChange, label }) => {
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
        <Typography sx={{ width: 50, textAlign: "center" }}>
          {value} / {max}
        </Typography>
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
