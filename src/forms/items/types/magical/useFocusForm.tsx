import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { FocusData } from "#/data/items/magicalData.ts"
import { MagicalType } from "#/data/items/magicalData.ts"
import { FocusType } from "#/data/magic/focusData.ts"
import type { GearSubmitMeta } from "#/forms/items/gearSubmitMeta.ts"
import { useItemForm } from "#/forms/items/useItemForm.tsx"

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
  // Magical gear has no Matrix presence unless the Player opts in.
  matrixDisabled: true,
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
