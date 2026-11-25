import type { FC } from "react"

import type { NuyenInputProps } from "#/components/ui/form/inputs/nuyen/nuyenInput.tsx"
import { NuyenInput } from "#/components/ui/form/inputs/nuyen/nuyenInput.tsx"
import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

import { useFieldErrors } from "./useFieldError.ts"

type NuyenFormFieldProps = Omit<NuyenInputProps, "value" | "onChange">

export const NuyenField: FC<NuyenFormFieldProps> = ({ ...props }) => {
  const field = useFieldContext<number | undefined>()
  const errors = useFieldErrors()

  return (
    <NuyenInput
      {...props}
      error={errors ? true : props.error}
      helperText={errors ? errors.join(", ") : props.helperText}
      value={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
    />
  )
}
