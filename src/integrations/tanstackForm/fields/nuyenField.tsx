import type { FC } from "react"

import type { NuyenFieldProps } from "#/components/ui/form/fields/nuyenField.tsx"
import { NuyenField as NuyenInputField } from "#/components/ui/form/fields/nuyenField.tsx"
import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

import { useFieldErrors } from "./useFieldError.ts"

type NuyenFormFieldProps = Omit<NuyenFieldProps, "value" | "onChange">

export const NuyenFormField: FC<NuyenFormFieldProps> = ({ ...props }) => {
  const field = useFieldContext<number | undefined>()
  const errors = useFieldErrors()

  return (
    <NuyenInputField
      {...props}
      error={errors ? true : props.error}
      helperText={errors ? errors.join(", ") : props.helperText}
      value={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
    />
  )
}
