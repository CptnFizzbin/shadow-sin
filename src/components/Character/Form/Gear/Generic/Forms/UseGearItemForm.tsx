import { createFieldMap, formOptions } from "@tanstack/form-core"
import type {
  GearItemFormState,
  GearItemRestriction,
} from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"

export type GearItemEditFormOptions = {
  mode: "edit"
  item: GearItemFormState
  onSubmit: (item: Omit<GearItemFormState, "items">) => void
}

export type GearItemCreateFormOptions = {
  mode: "create"
  onSubmit: (item: Omit<GearItemFormState, "items">) => void
}

export type GearItemFormOptions =
  | GearItemEditFormOptions
  | GearItemCreateFormOptions

const defaultFormValues = {
  id: "",
  name: "",
  cost: 0,
  description: "",
  availabilityRating: 0,
  availabilityRestriction: "none" as GearItemRestriction,
  sourceBook: "",
  sourcePage: 0,
}

export const gearItemFieldMap = createFieldMap(defaultFormValues)

export const gearItemFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useGearItemForm = (options: GearItemFormOptions) => {
  const defaults: typeof defaultFormValues =
    options.mode === "edit"
      ? {
          id: options.item.id,
          name: options.item.name,
          cost: options.item.cost,
          description: options.item.description,
          availabilityRating: options.item.availabilityRating,
          availabilityRestriction: options.item.availabilityRestriction,
          sourceBook: options.item.sourceBook,
          sourcePage: options.item.sourcePage,
        }
      : {
          ...defaultFormValues,
          id: crypto.randomUUID(),
        }

  return useAppForm({
    ...gearItemFormOpts,
    defaultValues: defaults,
    onSubmit: ({ value }) => {
      options.onSubmit({
        id: value.id,
        name: value.name,
        cost: value.cost ?? 0,
        description: value.description,
        availabilityRating: value.availabilityRating ?? 0,
        availabilityRestriction: value.availabilityRestriction,
        sourceBook: value.sourceBook,
        sourcePage: value.sourcePage ?? 0,
      })
    },
  })
}
