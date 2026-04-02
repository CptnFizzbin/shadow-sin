import { GearMaxAvailability } from "#/components/CharacterBuilder/Sections/Gear/gear-utils.ts"
import type { SelectOption } from "#/integrations/tanstack-form/Fields/select-field.tsx"

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
