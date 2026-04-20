import { InputAdornment } from "@mui/material"
import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField"
import MuiTextField from "@mui/material/TextField"
import type { ChangeEvent, FocusEvent, FC } from "react"
import { useEffect, useRef, useState } from "react"

export interface NuyenFieldProps extends Omit<MuiTextFieldProps, "type" | "value" | "onChange"> {
  value: number | undefined
  onChange: (value: number | undefined) => void
}

/**
 * Inserts commas every three digits from the right of a raw digit string.
 * Preserves leading zeros so that mid-edit transient states (e.g. "00") are
 * kept as-is rather than collapsed through Number conversion.
 */
export function applyCommasToDigits(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Returns the canonical display string for a persisted nuyen value.
 * undefined / NaN render as an empty string; 0 renders as "0".
 */
export function formatNuyenDisplay(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return ""
  return applyCommasToDigits(String(value))
}

/**
 * Counts how many commas appear before the `digitPosition`-th digit in
 * `formatted`. Used to map a raw-digit cursor position back to a position
 * inside the formatted string.
 *
 * @example
 * countCommasBeforeDigit("1,234", 2) // → 1  (comma before digit index 2)
 * countCommasBeforeDigit("1,234", 1) // → 0  (comma is after digit index 1)
 */
export function countCommasBeforeDigit(formatted: string, digitPosition: number): number {
  let digitsCount = 0
  let commaCount = 0
  for (const char of formatted) {
    if (digitsCount >= digitPosition) break
    if (char === ",") {
      commaCount++
    } else {
      digitsCount++
    }
  }
  return commaCount
}

/**
 * Given the raw input string and the browser's reported cursor position after
 * an edit, computes where the cursor should sit in the newly formatted string.
 *
 * Returns the raw digit string, the formatted string and the new cursor index.
 */
export function computeNuyenEdit(
  inputValue: string,
  selectionStart: number,
): { rawDigits: string, formatted: string, cursor: number } {
  const commasBeforeCursor = (inputValue.substring(0, selectionStart).match(/,/g) ?? []).length
  const rawCursorPos = selectionStart - commasBeforeCursor

  const rawDigits = inputValue.replace(/[^0-9]/g, "")
  const formatted = applyCommasToDigits(rawDigits)
  const newCommasBefore = countCommasBeforeDigit(formatted, rawCursorPos)

  return { rawDigits, formatted, cursor: rawCursorPos + newCommasBefore }
}

/**
 * A controlled text field that accepts a `number | undefined` value and
 * displays it formatted with thousands separators and a ¥ suffix adornment.
 *
 * Cursor tracking ensures the insertion point survives comma insertions and
 * removals so that mid-number edits feel natural.
 */
export const NuyenField: FC<NuyenFieldProps> = ({ value, onChange, onBlur, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const nextCursorRef = useRef<number | null>(null)

  const [displayValue, setDisplayValue] = useState(() => formatNuyenDisplay(value))
  const [prevPropValue, setPrevPropValue] = useState(value)

  // Sync display when the value is changed externally (not via our onChange).
  // Using the "store info from previous renders" pattern to avoid setState-in-effect.
  // We compare the numeric value implied by the current display string to the incoming
  // prop to distinguish external resets from echoed onChange updates.
  if (prevPropValue !== value) {
    setPrevPropValue(value)
    const currentNumericDisplay =
      displayValue === "" ? undefined : Number(displayValue.replace(/,/g, ""))
    if (currentNumericDisplay !== value) {
      setDisplayValue(formatNuyenDisplay(value))
    }
  }

  // Apply the deferred cursor position after every render so that React's
  // controlled-input reconciliation does not reset it.
  useEffect(() => {
    if (nextCursorRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(nextCursorRef.current, nextCursorRef.current)
      nextCursorRef.current = null
    }
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { rawDigits, formatted, cursor } = computeNuyenEdit(
      e.target.value,
      e.target.selectionStart ?? e.target.value.length,
    )

    nextCursorRef.current = cursor

    const numericValue = rawDigits === "" ? undefined : Number(rawDigits)
    setDisplayValue(formatted)
    onChange(numericValue)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Canonicalize the display (e.g. "00" → "0") when the field loses focus.
    setDisplayValue(formatNuyenDisplay(value))
    onBlur?.(e)
  }

  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      inputRef={inputRef}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      slotProps={{
        ...props.slotProps,
        input: {
          endAdornment: <InputAdornment position="end">¥</InputAdornment>,
        },
      }}
    />
  )
}
