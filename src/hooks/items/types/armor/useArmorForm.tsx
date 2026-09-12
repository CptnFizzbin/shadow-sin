import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { useItemForm } from "#/hooks/items/forms/useItemForm.tsx"
import type { UUID } from "#/lib/uuidUtils.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

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
  equipped: false,
  stashed: false,
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
