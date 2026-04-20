import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField"
import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

interface NumberFieldProps extends Omit<MuiTextFieldProps, "type" | "value" | "onChange"> {
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
}

export const NumberField: FC<NumberFieldProps> = ({ value, onChange, min, step, ...props }) => {
  return (
    <MuiTextField
      {...props}
      type="number"
      value={value}
      onChange={(e) => {
        const parsed = Number.parseFloat(e.target.value)
        if (!Number.isNaN(parsed)) {
          onChange(parsed)
        }
      }}
      slotProps={{ htmlInput: { min, step: step ?? 1, ...props.slotProps?.htmlInput } }}
    />
  )
}
