import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/lib/system/gear/implantData.ts"
import { ItemType } from "#/lib/system/itemType.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

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

export const useImplantForm = (options: ImplantFormOptions) => {
  return useAppForm({
    ...implantFormOpts,
    defaultValues: {
      ...defaultFormValues,
      parentId: options.parentId,
      ...options.implant,
    },
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => options.onSubmit(value, meta),
  })
}
