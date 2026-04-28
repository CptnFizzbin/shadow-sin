import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField"
import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

import { useFieldErrors } from "./useFieldError.ts"

interface NumberFieldProps extends Omit<
  MuiTextFieldProps,
  "type" | "value" | "onChange" | "onBlur"
> {}

export const NumberField: FC<NumberFieldProps> = ({ ...props }) => {
  const field = useFieldContext<number | undefined>()
  const errors = useFieldErrors()

  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      error={errors ? true : props.error}
      helperText={errors ? errors.join(", ") : props.helperText}
      type="number"
      value={field.state.value ?? ""}
      onBlur={field.handleBlur}
      onChange={(e) => {
        const value = e.target.value
        if (value === "") {
          field.handleChange(undefined)
        } else {
          field.handleChange(Number(e.target.value))
        }
      }}
    />
  )
}
