import type { FormControlProps, FormHelperTextProps, InputLabelProps, MenuItemProps, SelectProps } from "@mui/material"
import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"

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
  slotProps?: {
    select?: Partial<Omit<SelectProps, "value" | "onBlur" | "onChange">>
    menuItem?: Partial<MenuItemProps>
    inputLabel?: Partial<InputLabelProps>
    formControl?: Partial<FormControlProps>
    formHelperText?: Partial<FormHelperTextProps>
  }
}

export const SelectField: FC<SelectFieldProps> = ({
  options,
  label,
  slotProps,
  ...props
}) => {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()

  return (
    <FormControl error={errors !== null} {...props} {...slotProps?.formControl}>
      <InputLabel {...slotProps?.inputLabel}>{label}</InputLabel>
      <Select
        value={field.state.value ?? ""}
        label={label}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value as string)}
        {...slotProps?.select}
      >
        {options.map((option) => (
          <MenuItem
            value={option.value}
            key={option.value}
            disabled={option.disabled}
            sx={{ display: "flex" }}
            {...slotProps?.menuItem}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {errors !== null && (
        <FormHelperText {...slotProps?.formHelperText}>
          {errors.join(", ")}
        </FormHelperText>
      )}
    </FormControl>
  )
}
