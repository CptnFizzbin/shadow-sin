import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import {
  defaultGearSubmitMeta,

} from "#/components/gear/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export interface ItemFormOptions {
  item?: ItemData
  onSubmit: (item: ItemData, meta: GearSubmitMeta) => void
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
        }

  return useAppForm({
    ...gearItemFormOpts,
    defaultValues: defaults,
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit(value, meta),
  })
}
