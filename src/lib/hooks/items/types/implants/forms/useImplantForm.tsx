import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { useItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"

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
  items: { parentId: NullUuid, childIds: [NullUuid] },
  capacity: 0,
  capacityCost: 0,
  quantity: 0,
  rating: undefined as number | undefined,
  notes: "",
  equipped: false,
  stashed: false,
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
