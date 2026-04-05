import { GearMaxAvailability } from "#/components/characterBuilder/sections/gear/gearUtils.ts"
import type { SelectOption } from "#/integrations/tanstackForm/fields/selectField.tsx"

const MaxRating = Math.floor(GearMaxAvailability / 3)

export const RealRatingOptions = (disabled?: boolean): SelectOption[] => {
  return [{ label: `Real`, value: "real", disabled }]
}

export const FakeRatingOptions = (): SelectOption[] => {
  return Array.from({ length: MaxRating }, (_, i) => (i + 1).toString()).map(
    (rating) => ({
      label: rating,
      value: rating,
    }),
  )
}
