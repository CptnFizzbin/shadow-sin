import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ImplantData } from "#/data/items/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/data/items/implantData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { GearSubmitMeta } from "#/forms/items/gearSubmitMeta.ts"
import { useItemForm } from "#/forms/items/useItemForm.tsx"

interface ImplantFormOptions {
  implant?: ImplantData
  parentId?: UUID
  onSubmit: (implant: ImplantData, meta: GearSubmitMeta) => void
}

const defaultFormValues: ImplantData = {
  kind: EntityKind.item,
  itemType: ItemType.implant,
  id: NullUuid,
  name: "",
  cost: 0,
  essenceCost: 0,
  grade: ImplantGrade.standard,
  implantType: ImplantType.cyberware,
  location: ImplantLocation.head,
  description: "",
  availability: {
    rating: 1,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  items: { parentId: NullUuid, childIds: [] },
  capacity: 0,
  capacityCost: 0,
  quantity: 0,
  rating: undefined as number | undefined,
  notes: "",
  state: ItemState.implanted,
  fixed: false,
  wireless: {
    enabled: false,
    removed: false,
  },
  effects: [],
}

export const implantFieldMap = createFieldMap(defaultFormValues)

export const implantFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useImplantForm = ({ implant, parentId, onSubmit }: ImplantFormOptions) => {
  return useItemForm<ImplantData>({
    item: implant,
    defaultValues: { ...defaultFormValues, items: { ...defaultFormValues.items, parentId: parentId ?? null } },
    onSubmit,
  })
}
