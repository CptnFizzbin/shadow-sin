import {
  FormControl,
  type FormControlProps,
  InputLabel,
  Select,
} from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"
import { useFieldContext } from "../FieldContext.ts"

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

  return (
    <FormControl {...props}>
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
            disabled={option.disabled}
            sx={{ display: "flex" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
