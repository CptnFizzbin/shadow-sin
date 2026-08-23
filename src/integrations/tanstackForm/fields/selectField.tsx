import type { FormControlProps } from "@mui/material/FormControl"
import FormControl from "@mui/material/FormControl"
import type { FormHelperTextProps } from "@mui/material/FormHelperText"
import FormHelperText from "@mui/material/FormHelperText"
import type { InputLabelProps } from "@mui/material/InputLabel"
import InputLabel from "@mui/material/InputLabel"
import ListSubheader from "@mui/material/ListSubheader"
import type { MenuItemProps } from "@mui/material/MenuItem"
import MenuItem from "@mui/material/MenuItem"
import type { SelectProps } from "@mui/material/Select"
import Select from "@mui/material/Select"
import { sort } from "fast-sort"
import type { FC, ReactNode } from "react"

import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

import { useFieldErrors } from "./useFieldError.ts"

export interface SelectOption {
  group?: string
  label: ReactNode
  value: string
  disabled?: boolean
}

interface SelectFieldProps extends FormControlProps {
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

  const currentValue = field.state.value ?? ""
  // A field's stored value can outlive the option it once matched — e.g. `parentId` pointing at
  // a since-deleted gear item (see `removeItemById`'s "leaves any children orphaned" comment).
  // MUI's Select warns when its `value` doesn't match any rendered MenuItem, so an orphaned
  // value gets a hidden placeholder item to match against instead of dropping the reference.
  const hasCurrentOption = currentValue === "" || options.some((option) => option.value === currentValue)

  const noGroupSymbol = Symbol("ungrouped").toString()
  const optionsByGroup = Object.groupBy(options, (option) => option.group ?? noGroupSymbol)

  const groupKeys = sort(Object.keys(optionsByGroup)).by([
    { asc: (key) => key === noGroupSymbol },
    { asc: (key) => key },
  ])

  return (
    <FormControl error={errors !== null} {...props} {...slotProps?.formControl}>
      <InputLabel {...slotProps?.inputLabel}>{label}</InputLabel>
      <Select
        value={currentValue}
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
        {!hasCurrentOption && <MenuItem value={currentValue} sx={{ display: "none" }} />}

        {groupKeys.map((groupKey) => {
          const items: ReactNode[] = []

          if (groupKey !== noGroupSymbol) {
            items.push(
              <ListSubheader
                key={`group-${groupKey}`}
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  lineHeight: "initial",
                  padding: 0,
                  marginX: 2,
                }}
              >
                {groupKey}
              </ListSubheader>,
            )
          }

          const groupOptions = optionsByGroup[groupKey] ?? []
          sort(groupOptions)
            .by([{ asc: (option) => option.value !== "" }])
            .forEach((item) => items.push(
              <MenuItem
                key={`option-${item.value}`}
                sx={{ display: "flex" }}
                {...slotProps?.menuItem}
                value={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </MenuItem>,
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
