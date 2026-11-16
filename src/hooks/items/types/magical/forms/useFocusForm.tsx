import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/entities/items/gearSubmitMeta.ts"
import { useItemForm } from "#/hooks/items/forms/useItemForm.tsx"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import { MagicalType } from "#/system/model/items/magicalData.ts"
import { FocusType } from "#/system/model/magic/focusData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

interface FocusFormOptions {
  focus?: FocusData
  parentId?: UUID
  onSubmit: (focus: FocusData, meta: GearSubmitMeta) => void
}

const defaultFormValues: FocusData = {
  kind: EntityKind.item,
  id: NullUuid,
  itemType: ItemType.magical,
  magicalType: MagicalType.focus,
  focusType: FocusType.Power,
  force: 1,
  // Listed even while unset so the focus field group's field map includes them.
  spellCategory: undefined,
  spiritType: undefined,
  bonded: false,
  name: "",
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
}

export const focusFieldMap = createFieldMap(defaultFormValues)

export const focusFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useFocusForm = ({ focus, parentId, onSubmit }: FocusFormOptions) => {
  return useItemForm<FocusData>({
    item: focus,
    defaultValues: parentId
      ? { ...defaultFormValues, items: { ...defaultFormValues.items, parentId } }
      : defaultFormValues,
    onSubmit,
  })
}
