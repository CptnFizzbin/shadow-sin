import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import type { TextFieldProps } from "@mui/material/TextField"
import TextField from "@mui/material/TextField"
import { RiAddLine, RiSubtractLine } from "@remixicon/react"
import type { ChangeEventHandler, FC, ReactNode } from "react"

import { NumberUtils } from "#/lib/numberUtils.ts"
import styles from "./counter.module.css"

export interface CounterProps extends Omit<TextFieldProps, "value" | "onChange"> {
  value: number | null
  min?: number
  max?: number
  onChange: (newValue: number | null) => void
  label?: string
  unit?: ReactNode
}

export const Counter: FC<CounterProps> = ({ value, min, max, onChange, label, unit }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const strValue = e.target.value.trim()
    if (!strValue) {
      onChange(null)
      return
    }

    const nextValue = Number.parseInt(e.target.value)
    if (Number.isNaN(nextValue)) {
      onChange(null)
    } else {
      onChange(NumberUtils.clamp(nextValue, { min, max }))
    }
  }

  const handleDecrement = () => {
    const current = value ?? min ?? 0
    onChange(NumberUtils.clamp(current - 1, { min, max }))
  }

  const handleIncrement = () => {
    const current = value ?? min ?? 0
    onChange(NumberUtils.clamp(current + 1, { min, max }))
  }

  const isAtMin = value !== null && min !== undefined && value <= min
  const isAtMax = value !== null && max !== undefined && value >= max

  return (
    <TextField
      label={label}
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      className={styles.numberField}
      slotProps={{
        htmlInput: {
          style: { textAlign: "center", minWidth: 50 },
        },
        input: {
          sx: {
            padding: 0,
            width: "min-content",
          },
          startAdornment: (
            <InputAdornment position="start">
              <Button sx={{ minWidth: "unset" }} onClick={handleDecrement} disabled={isAtMin}>
                <RiSubtractLine />
              </Button>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {unit}
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
