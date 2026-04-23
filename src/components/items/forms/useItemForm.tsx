import { createFieldMap, formOptions } from "@tanstack/form-core"
import type { AppFieldExtendedReactFormApi } from "@tanstack/react-form"

import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface ItemFormOptions<TData extends ItemData = ItemData> {
  item?: TData
  defaultValues: TData
  onSubmit: (item: TData, meta: GearSubmitMeta) => void
}

export const itemDefaults: ItemData = {
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

export const itemFieldMap = createFieldMap(itemDefaults)

export const itemFormOpts = formOptions({
  defaultValues: itemDefaults,
})

export const useItemForm = <TData extends ItemData>({
  item,
  defaultValues: baseDefaults,
  onSubmit,
}: ItemFormOptions<TData>) => {
  const defaults: TData = item
    ? { ...baseDefaults, ...item, quantity: item.quantity ?? baseDefaults.quantity }
    : { ...baseDefaults }

  return useAppForm({
    defaultValues: defaults,
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit(value, meta),
  })
}

export type ItemForm = ReturnType<typeof useItemForm<ItemData>>

/**
 * Accepts any item form (ArmorData, WeaponData, ImplantData, etc.) without
 * requiring unsafe double type assertions. Item-specific forms are assignable to
 * this type because their submit meta matches and the field data is `any`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyItemForm = AppFieldExtendedReactFormApi<any, any, any, any, any, any, any, any, any, any, any, GearSubmitMeta, any, any>
