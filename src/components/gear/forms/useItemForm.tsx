import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface ItemFormOptions {
  item?: ItemData
  itemType?: ItemType
  onSubmit: (item: ItemData, meta: GearSubmitMeta) => void
}

const defaultFormValues: ItemData = {
  id: NullUuid,
  itemType: ItemType.other,
  name: "",
  cost: 0,
  quantity: 1,
  rating: undefined,
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
  parentId: undefined,
  effects: [],
}

export const gearItemFieldMap = createFieldMap(defaultFormValues)

export const gearItemFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export type ItemForm = ReturnType<typeof useItemForm>

export const useItemForm = ({ item, itemType, onSubmit }: ItemFormOptions) => {
  const defaults: typeof defaultFormValues =
    typeof item !== "undefined"
      ? {
          ...defaultFormValues,
          ...item,
          quantity: item.quantity ?? 1,
        }
      : {
          ...defaultFormValues,
          itemType: itemType ?? ItemType.other,
        }

  return useAppForm({
    ...gearItemFormOpts,
    defaultValues: defaults,
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit(value, meta),
  })
}
