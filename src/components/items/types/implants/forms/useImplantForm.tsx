import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useItemForm } from "#/components/items/forms/useItemForm.tsx"
import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface ImplantFormOptions {
  implant?: ImplantData
  parentId?: UUID
  onSubmit: (implant: ImplantData, meta: GearSubmitMeta) => void
}

const defaultFormValues: ImplantData = {
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
  parentId: NullUuid,
  capacity: 0,
  capacityCost: 0,
  quantity: 0,
  rating: undefined as number | undefined,
  childIds: [NullUuid],
  notes: "",
  equipped: false,
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
    defaultValues: { ...defaultFormValues, parentId },
    onSubmit,
  })
}
