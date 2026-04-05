import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/lib/system/gear/implantData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export interface ImplantFormOptions {
  implant?: ImplantData
  parentId?: UUID
  onSubmit: (implant: ImplantData) => void
}

const defaultFormValues: ImplantData = {
  itemType: GearType.implant,
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
  rating: "",
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

export const useImplantForm = (options: ImplantFormOptions) => {
  return useAppForm({
    ...implantFormOpts,
    defaultValues: {
      ...defaultFormValues,
      parentId: options.parentId,
      ...options.implant,
    },
    onSubmit: ({ value }) => options.onSubmit(value),
  })
}
