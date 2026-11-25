import type { FC } from "react"

import type { DurationInputProps } from "#/components/ui/form/inputs/duration/durationInput.tsx"
import { DurationInput } from "#/components/ui/form/inputs/duration/durationInput.tsx"
import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"
import type { Duration } from "#/utils/duration/duration.ts"

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
