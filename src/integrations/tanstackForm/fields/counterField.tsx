import type { FC } from "react"

import { Counter } from "#/components/ui/counter/counter.tsx"
import { useFieldContext } from "#/integrations/tanstackForm/fieldContext.ts"

interface CounterFieldProps {
  min: number
  max?: number
  step?: number
  label?: string
}

export const CounterField: FC<CounterFieldProps> = ({ min, max, step, label }) => {
  const field = useFieldContext<number | undefined>()

  return (
    <Counter
      value={field.state.value ?? min}
      min={min}
      max={max}
      step={step}
      label={label}
      onChange={(newValue) => field.handleChange(newValue ?? undefined)}
    />
  )
}
