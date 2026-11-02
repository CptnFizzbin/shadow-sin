import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useId } from "react"

import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"

interface GmCounterFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

/** A labelled number counter row for entering a stat the GM reads off an NPC or Runner. */
export const GmCounterField: FC<GmCounterFieldProps> = ({ label, value, onChange, min = 0, max = 99 }) => {
  const inputId = useId()

  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
      <Typography variant="body2" component="label" htmlFor={inputId} sx={{ flex: 1 }}>{label}</Typography>
      <CounterInput
        id={inputId}
        value={value}
        onChange={(newValue) => onChange(newValue ?? min)}
        min={min}
        max={max}
        size="small"
      />
    </Stack>
  )
}
