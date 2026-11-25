import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { UUID } from "#common/uuid/uuidUtils.ts"
import { NullUuid } from "#common/uuid/uuidUtils.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import type { DrugData } from "#data/items/consumableData.ts"
import { ConsumableType } from "#data/items/consumableData.ts"
import { ItemState } from "#data/items/itemState.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { GearSubmitMeta } from "#forms/items/gearSubmitMeta.ts"
import { useItemForm } from "#forms/items/useItemForm.tsx"

interface DrugFormOptions {
  drug?: DrugData
  parentId?: UUID
  onSubmit: (drug: DrugData, meta: GearSubmitMeta) => void
}

const defaultFormValues: DrugData = {
  kind: EntityKind.item,
  id: NullUuid,
  itemType: ItemType.consumable,
  consumableType: ConsumableType.drug,
  name: "",
  duration: "",
  crash: "",
  effectDescription: "",
  cost: 0,
  quantity: 1,
  description: "",
  state: ItemState.available,
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  items: { parentId: null, childIds: [] },
  effects: [],
}

export const drugFieldMap = createFieldMap(defaultFormValues)

export const drugFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useDrugForm = ({ drug, parentId, onSubmit }: DrugFormOptions) => {
  return useItemForm<DrugData>({
    item: drug,
    defaultValues: parentId
      ? { ...defaultFormValues, items: { ...defaultFormValues.items, parentId } }
      : defaultFormValues,
    onSubmit,
  })
}
