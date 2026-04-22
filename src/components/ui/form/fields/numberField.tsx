import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField"
import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import { NumberUtils } from "#/lib/numberUtils.ts"

interface NumberFieldProps extends Omit<MuiTextFieldProps, "type" | "value" | "onChange"> {
  value: number
  onChange: (value: number | null) => void
  min?: number
  max?: number
  step?: number
}

export const NumberField: FC<NumberFieldProps> = ({ value, onChange, min, max, step, ...props }) => {
  const [localValue, setLocalValue] = useState<string>(value.toString())

  return (
    <MuiTextField
      {...props}
      type="number"
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value)
        const parsed = Number.parseFloat(e.target.value)
        if (!Number.isNaN(parsed)) {
          const next = NumberUtils.clamp(parsed, { min, max })
          onChange(next)
        } else {
          onChange(null)
        }
      }}
      slotProps={{
        ...props.slotProps,
        htmlInput: {
          min,
          max,
          step: step ?? 1,
          ...props.slotProps?.htmlInput,
        },
      }}
    />
  )
}
