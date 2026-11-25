import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import type { ReactNode } from "react"

import { Label } from "#/components/ui/text/label.tsx"

interface GmToggleButtonsProps<TValue extends string> {
  label: string
  value: TValue
  options: { value: TValue, label: ReactNode }[]
  onChange: (value: TValue) => void
}

/** A labelled, full-width single-choice button group. */
export const GmToggleButtons = <TValue extends string>({
  label,
  value,
  options,
  onChange,
}: GmToggleButtonsProps<TValue>) => (
  <Stack sx={{ gap: 0.5 }}>
    <Label label={label} />
    <ButtonGroup size="small" variant="outlined" fullWidth>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "contained" : "outlined"}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  </Stack>
)
