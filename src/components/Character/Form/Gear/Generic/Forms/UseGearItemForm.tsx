import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"
import { GearType } from "#/lib/system/types/gear/gearData.ts"

export type GearItemEditFormOptions = {
  mode: "edit"
  item: GearData
  onSubmit: (item: GearData) => void
}

export type GearItemCreateFormOptions = {
  mode: "create"
  onSubmit: (item: GearData) => void
}

export type GearItemFormOptions =
  | GearItemEditFormOptions
  | GearItemCreateFormOptions

const defaultFormValues: GearData = {
  id: "",
  name: "",
  type: GearType.other,
  cost: 0,
  notes: "",
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
