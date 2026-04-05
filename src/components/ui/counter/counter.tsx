import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"

const counterButtonSx = {
  "width": 32,
  "height": 32,
  "border": "1px solid",
  "borderColor": "primary.dark",
  "backgroundColor": "background.paper",
  "color": "text.primary",
  "cursor": "pointer",
  "fontSize": "1.25rem",
  "display": "flex",
  "alignItems": "center",
  "justifyContent": "center",
  "&:disabled": {
    borderColor: "action.disabled",
    color: "action.disabled",
    cursor: "not-allowed",
  },
  "&:hover:not(:disabled)": {
    backgroundColor: "primary.light",
    color: "common.black",
  },
} as const

export interface CounterProps {
  value: number
  min: number
  max: number
  onChange: (newValue: number) => void
  label?: string
}

export const Counter: FC<CounterProps> = ({ value, min, max, onChange, label }) => {
  return (
    <Stack alignItems="center" gap={0.5}>
      {label && <Label label={label} />}
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Box
          component="button"
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          sx={counterButtonSx}
        >
          −
        </Box>
        <Typography variant="body1" sx={{ minWidth: 48, textAlign: "center" }}>
          {value} / {max}
        </Typography>
        <Box
          component="button"
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          sx={counterButtonSx}
        >
          +
        </Box>
      </Stack>
    </Stack>
  )
}
