import type { FormControlProps } from "@mui/material"
import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"
import { useId } from "react"

import { useFieldContext } from "#/integrations/tanstack-form/FieldContext.ts"
import { useFieldErrors } from "#/integrations/tanstack-form/Fields/UseFieldError.ts"

export interface SelectOption {
  label: ReactNode
  value: string
  disabled?: boolean
}

export interface SelectFieldProps extends FormControlProps {
  label: ReactNode
  options: SelectOption[]
}

export const SelectField: FC<SelectFieldProps> = ({
  options,
  label,
  ...props
}) => {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  const labelId = useId()

  return (
    <FormControl error={errors !== null} {...props}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={field.state.value}
        label={label}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem
            value={option.value}
            key={option.value}
            disabled={option.disabled}
            sx={{ display: "flex" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {errors !== null && <FormHelperText>{errors.join(", ")}</FormHelperText>}
    </FormControl>
  )
}
