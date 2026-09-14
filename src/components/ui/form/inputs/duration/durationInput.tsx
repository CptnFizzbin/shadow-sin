import type { FormControlProps } from "@mui/material/FormControl"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import type { SelectChangeEvent } from "@mui/material/Select"
import Select from "@mui/material/Select"
import { RiPencilLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { useDurationDialog } from "#/components/ui/dialog/durationDialog.tsx"
import type { Duration } from "#/utils/duration/duration.ts"
import { StandardDurations } from "#/utils/duration/duration.ts"
import { DurationUtils } from "#/utils/duration/durationUtils.ts"

const CUSTOM_OPTION_VALUE = "custom"

export interface DurationInputProps extends Omit<FormControlProps, "value" | "onChange"> {
  label?: ReactNode
  value: Duration | undefined
  onChange: (value: Duration) => void
}

/**
 * A `Select` for choosing a `Duration`: one `StandardDurations` entry, or a "Custom…" option
 * that opens a dialog with a counter per `DurationUnit`.
 */
export const DurationInput: FC<DurationInputProps> = ({ label, value, onChange, ...props }) => {
  const customDurationDialog = useDurationDialog()

  const standardIndex = value ? StandardDurations.findIndex((duration) => DurationUtils.equals(duration, value)) : -1
  const selectedValue = value === undefined ? "" : standardIndex >= 0 ? String(standardIndex) : CUSTOM_OPTION_VALUE

  const openCustomDurationDialog = async () => {
    const result = await customDurationDialog.open({ initialValue: value ?? {} })
    if (result) onChange(result)
  }

  const handleChange = async (e: SelectChangeEvent) => {
    if (e.target.value === CUSTOM_OPTION_VALUE) {
      await openCustomDurationDialog()
      return
    }

    const selected = StandardDurations[Number(e.target.value)]
    if (selected) onChange(selected)
  }

  return (
    <FormControl fullWidth size="small" {...props}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={selectedValue}
        label={label}
        onChange={handleChange}
        renderValue={(renderedValue) => {
          if (renderedValue === CUSTOM_OPTION_VALUE) {
            return value ? DurationUtils.format(value) : "Custom…"
          }
          const selected = StandardDurations[Number(renderedValue)]
          return selected ? DurationUtils.format(selected) : ""
        }}
        endAdornment={selectedValue === CUSTOM_OPTION_VALUE && (
          <InputAdornment position="end" sx={{ marginRight: 2 }}>
            <IconButton
              size="small"
              aria-label="Edit custom duration"
              onClick={openCustomDurationDialog}
            >
              <RiPencilLine size={16} />
            </IconButton>
          </InputAdornment>
        )}
      >
        {StandardDurations.map((duration, index) => (
          <MenuItem key={index} value={String(index)}>
            {DurationUtils.format(duration)}
          </MenuItem>
        ))}
        <MenuItem value={CUSTOM_OPTION_VALUE}>Custom…</MenuItem>
      </Select>

      {customDurationDialog.outlet}
    </FormControl>
  )
}
