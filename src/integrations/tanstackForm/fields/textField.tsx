import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField"
import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

import { useFieldErrors } from "#/integrations/tanstackForm/fields/useFieldError.ts"
import { useFieldContext } from "../fieldContext.ts"

interface TextFieldProps extends Omit<
  MuiTextFieldProps,
  "value" | "onChange" | "onBlur"
> {}

export const TextField: FC<TextFieldProps> = ({ ...props }) => {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()

  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      error={errors ? true : props.error}
      helperText={errors ? errors.join(", ") : props.helperText}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
    />
  )
}
