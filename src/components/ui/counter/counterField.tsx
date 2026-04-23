import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import type { TextFieldProps } from "@mui/material/TextField"
import TextField from "@mui/material/TextField"
import { RiAddLine, RiSubtractLine } from "@remixicon/react"
import classnames from "classnames"
import type { ChangeEventHandler, FC } from "react"
import { useState } from "react"

import styles from "#/components/ui/counter/counter.module.css"
import { mergeSx } from "#/integrations/mui/muiUtils.ts"
import { NumberUtils } from "#/lib/numberUtils.ts"

type OmittedProps =
  | "value"
  | "onChange"
  | "onFocus"
  | "onBlur"
  | "type"
  | "slot"
  | "slotProps"

export interface CounterFieldProps extends Omit<TextFieldProps, OmittedProps> {
  value: number | null
  onChange: (newValue: number | null) => void
  min?: number
  max?: number
  showMax?: boolean
  step?: number
}

export const CounterField: FC<CounterFieldProps> = ({
  value,
  onChange,
  min,
  max,
  showMax,
  step = 1,
  ...props
}) => {
  const [localValue, setLocalValue] = useState<string | null>(null)
  const displayValue = localValue ?? (value?.toString() ?? "")

  const handleFocus = () => {
    setLocalValue(value?.toString() ?? "")
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const sanitized = e.target.value.replace(/[^\d.+-]/g, "")
    setLocalValue(sanitized)

    const parsed = Number.parseFloat(sanitized)
    if (!Number.isNaN(parsed)) {
      onChange(NumberUtils.clamp(parsed, { min, max }))
    }
  }

  const handleBlur = () => {
    if (localValue === null) return

    const parsed = Number.parseFloat(localValue.trim())
    if (Number.isNaN(parsed)) {
      onChange(null)
    }

    setLocalValue(null)
  }

  const handleDecrement = () => {
    const current = value ?? min ?? 0
    // toFixed(10) eliminates floating-point drift (e.g. 0.1 + 0.2 = 0.30000000000000004)
    onChange(NumberUtils.clamp(Number((current - step).toFixed(10)), { min, max }))
  }

  const handleIncrement = () => {
    const current = value ?? min ?? 0
    // toFixed(10) eliminates floating-point drift (e.g. 0.1 + 0.2 = 0.30000000000000004)
    onChange(NumberUtils.clamp(Number((current + step).toFixed(10)), { min, max }))
  }

  const isAtMin = value !== null && min !== undefined && value <= min
  const isAtMax = value !== null && max !== undefined && value >= max

  return (
    <TextField
      {...props}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={classnames(props.className, styles.numberField)}
      sx={mergeSx({
        ".MuiInputBase-root": {
          maxWidth: props.fullWidth ? "100%" : 150,
          padding: 0,
        },
        "input": {
          textAlign: "center",
        },
      }, props.sx)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Button sx={{ minWidth: "unset" }} onClick={handleDecrement} disabled={isAtMin}>
                <RiSubtractLine />
              </Button>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button sx={{ minWidth: "unset" }} onClick={handleIncrement} disabled={isAtMax}>
                <RiAddLine />
              </Button>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
