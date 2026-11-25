import type { FC } from "react"

import type { Duration } from "#/data/duration/duration.ts"
import type { DurationInputProps } from "#/forms/duration/durationInput.tsx"
import { DurationInput } from "#/forms/duration/durationInput.tsx"
import { useFieldContext } from "#/forms/tanstackForm/fieldContext.ts"

import { useFieldErrors } from "./useFieldError.ts"

interface DurationFieldProps extends Omit<
  DurationInputProps,
  "type" | "value" | "onChange" | "onBlur"
> {}

export const DurationField: FC<DurationFieldProps> = ({ ...props }) => {
  const field = useFieldContext<Duration | undefined>()
  const errors = useFieldErrors()

  return (
    <DurationInput
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      error={errors ? true : props.error}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
    />
  )
}
