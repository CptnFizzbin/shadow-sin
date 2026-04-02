import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { NullUuid } from "#/lib/UuidUtils.ts"
import type { ItemData } from "#/lib/system/ItemData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export interface ItemFormOptions {
  item?: ItemData
  onSubmit: (item: ItemData) => void
}

const defaultFormValues: ItemData = {
  id: NullUuid,
  itemType: GearType.other,
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
  effects: [],
}

export const gearItemFieldMap = createFieldMap(defaultFormValues)

export const gearItemFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useItemForm = ({ item, onSubmit }: ItemFormOptions) => {
  const defaults: typeof defaultFormValues =
    typeof item !== "undefined"
      ? {
          ...defaultFormValues,
          ...item,
          quantity: item.quantity ?? 1,
        }
      : {
          ...defaultFormValues,
          id: crypto.randomUUID(),
        }

  return useAppForm({
    ...gearItemFormOpts,
    defaultValues: defaults,
    onSubmit: ({ value }) => onSubmit(value),
  })
}
