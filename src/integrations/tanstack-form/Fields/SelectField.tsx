import {
  FormControl,
  type FormControlProps,
  FormHelperText,
  type FormHelperTextProps,
  InputLabel,
  type InputLabelProps,
  ListSubheader,
  type MenuItemProps,
  Select,
  type SelectProps
} from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"

import { useFieldContext } from "#/integrations/tanstack-form/FieldContext.ts"
import { useFieldErrors } from "#/integrations/tanstack-form/Fields/UseFieldError.ts"
import { sort } from "fast-sort"

export interface SelectOption {
  group?: string
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

  const noGroupSymbol = Symbol("ungrouped")
  const optionsByGroup = Object.groupBy(options, (option) => option.group ?? noGroupSymbol)

  const groupKeys = sort(Object.keys(optionsByGroup)).by([
    { asc: (key) => key === String(noGroupSymbol) ? 1 : -1 },
    { asc: (key) => key },
  ])

  return (
    <FormControl error={errors !== null} {...props} {...slotProps?.formControl}>
      <InputLabel {...slotProps?.inputLabel}>{label}</InputLabel>
      <Select
        value={field.state.value ?? ""}
        label={label}
        onBlur={field.handleBlur}
        onChange={(e) => {
          if ("value" in e.target) {
            const value = e.target.value as string
            field.handleChange(value)
          }
        }}
        {...slotProps?.select}
      >
        {groupKeys.map((groupKey) => {
          const items: ReactNode[] = []

          if (groupKey !== String(noGroupSymbol)) {
            items.push(<ListSubheader key={`group-${groupKey}`}>{groupKey}</ListSubheader>)
          }

          const groupOptions = optionsByGroup[groupKey] ?? []
          groupOptions.forEach((item) => (
            <MenuItem
              key={`option-${item.value}`}
              sx={{ display: "flex" }}
              {...slotProps?.menuItem}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </MenuItem>
          ))

          return items
        })}
      </Select>

      {errors !== null && (
        <FormHelperText {...slotProps?.formHelperText}>
          {errors.join(", ")}
        </FormHelperText>
      )}
    </FormControl>
  )
}
