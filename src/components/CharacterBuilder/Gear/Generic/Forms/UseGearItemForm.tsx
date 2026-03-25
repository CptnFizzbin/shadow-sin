import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"

export type GearItemEditFormOptions = {
  mode: "edit"
  item: GearItemFormState
  onSubmit: (item: GearItemFormState) => void
}

export type GearItemCreateFormOptions = {
  mode: "create"
  onSubmit: (item: GearItemFormState) => void
}

export type GearItemFormOptions =
  | GearItemEditFormOptions
  | GearItemCreateFormOptions

const defaultFormValues: GearItemFormState = {
  id: "",
  name: "",
  cost: 0,
  quantity: 1,
  description: "",
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
}

export const gearItemFieldMap = createFieldMap(defaultFormValues)

export const gearItemFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useGearItemForm = (options: GearItemFormOptions) => {
  const defaults: typeof defaultFormValues =
    options.mode === "edit"
      ? {
          ...defaultFormValues,
          ...options.item,
          quantity: options.item.quantity ?? 1,
        }
      : {
          ...defaultFormValues,
          id: crypto.randomUUID(),
        }

  return useAppForm({
    ...gearItemFormOpts,
    defaultValues: defaults,
    onSubmit: ({ value }) => options.onSubmit(value),
  })
}
