import type { FC } from "react"

import type { CounterFieldProps as CounterInputProps } from "#/components/ui/counter/counterField.tsx"
import { CounterField as CounterInput } from "#/components/ui/counter/counterField.tsx"
import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

interface CounterFieldProps extends Omit<CounterInputProps, "value" | "onChange" | "onBlur"> {

}

export const CounterField: FC<CounterFieldProps> = ({ min, ...props }) => {
  const field = useFieldContext<number | undefined>()

  return (
    <CounterInput
      {...props}
      min={min}
      value={field.state.value ?? min ?? null}
      onChange={(newValue) => field.handleChange(newValue ?? undefined)}
    />
  )
}
