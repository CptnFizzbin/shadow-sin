import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ArmorData } from "#/data/items/armorData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { GearSubmitMeta } from "#/forms/items/gearSubmitMeta.ts"
import { useItemForm } from "#/forms/items/useItemForm.tsx"

interface ArmorFormOptions {
  armor?: ArmorData
  parentId?: UUID
  onSubmit: (armor: ArmorData, meta: GearSubmitMeta) => void
}

const defaultFormValues: ArmorData = {
  kind: EntityKind.item,
  id: NullUuid,
  itemType: ItemType.armor,
  name: "",
  ballistic: 0,
  impact: 0,
  isModifier: false,
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

export const armorFieldMap = createFieldMap(defaultFormValues)

export const armorFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useArmorForm = ({ armor, parentId, onSubmit }: ArmorFormOptions) => {
  return useItemForm<ArmorData>({
    item: armor,
    defaultValues: parentId
      ? { ...defaultFormValues, items: { ...defaultFormValues.items, parentId } }
      : defaultFormValues,
    onSubmit,
  })
}
