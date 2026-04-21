import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import type { TextFieldProps } from "@mui/material/TextField"
import TextField from "@mui/material/TextField"
import { RiAddLine, RiSubtractLine } from "@remixicon/react"
import type { ChangeEventHandler, FC, ReactNode } from "react"
import { useState } from "react"

import { NumberUtils } from "#/lib/numberUtils.ts"
import styles from "./counter.module.css"

export interface CounterProps extends Omit<TextFieldProps, "value" | "onChange"> {
  value: number | null
  min?: number
  max?: number
  step?: number
  onChange: (newValue: number | null) => void
  label?: string
  unit?: ReactNode
}

export const Counter: FC<CounterProps> = ({ value, min, max, step = 1, onChange, label, unit }) => {
  // localValue holds the raw string while the user is editing. null means "not
  // editing" — the displayed value falls back to the controlled `value` prop.
  // This lets the user clear the field mid-edit and retype without immediately
  // committing null to the parent, and defers clamping to blur.
  const [localValue, setLocalValue] = useState<string | null>(null)

  const displayValue = localValue ?? (value?.toString() ?? "")

  const handleFocus = () => {
    setLocalValue(value?.toString() ?? "")
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    // Strip every character that is not a digit, sign, or decimal point.
    const sanitized = e.target.value.replace(/[^0-9+.-]/g, "")
    setLocalValue(sanitized)

    // If the sanitized string is already a valid number, commit it immediately
    // (clamped). Invalid/partial inputs like "", "-", "." are deferred to blur.
    const parsed = Number.parseFloat(sanitized)
    if (!Number.isNaN(parsed)) {
      onChange(NumberUtils.clamp(parsed, { min, max }))
    }
  }

  const handleBlur = () => {
    if (localValue === null) return

    // Only fire onChange for invalid/empty drafts — valid ones were already
    // committed inside handleChange.
    const parsed = Number.parseFloat(localValue.trim())
    if (Number.isNaN(parsed)) {
      onChange(null)
    }

    // Reset to "not editing" — the display reverts to the controlled value prop.
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
      label={label}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={styles.numberField}
      slotProps={{
        htmlInput: {
          style: { textAlign: "center", minWidth: 50 },
          inputMode: "decimal",
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
