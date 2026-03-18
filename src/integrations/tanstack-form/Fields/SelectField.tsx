import {
  FormControl,
  type FormControlProps,
  FormHelperText,
  InputLabel,
  Select,
} from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"
import { useFieldContext } from "#/integrations/tanstack-form/FieldContext.ts"
import { useFieldErrors } from "#/integrations/tanstack-form/Fields/UseFieldError.ts"

export interface SelectOption {
  label: ReactNode
  value: string
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

  return (
    <FormControl error={errors !== null} {...props}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={field.state.value}
        label={label}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem
            value={option.value}
            key={option.value}
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
