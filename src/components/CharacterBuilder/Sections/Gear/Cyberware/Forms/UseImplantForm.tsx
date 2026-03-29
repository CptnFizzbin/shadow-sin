import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import { NullGearId } from "#/components/Gear/GearUtils.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/lib/system/gear/implantData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export interface ImplantFormOptions {
  implant?: ImplantData
  parentId?: UUID
  onSubmit: (implant: ImplantData) => void
}

const defaultFormValues: ImplantData = {
  itemType: GearType.implant,
  id: NullGearId,
  name: "",
  cost: 0,
  essenceCost: 0,
  grade: ImplantGrade.standard,
  implantType: ImplantType.cyberware,
  location: ImplantLocation.head,
  description: "",
  availability: undefined,
  source: undefined,
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
      id: crypto.randomUUID(),
      parentId: options.parentId,
      ...options.implant,
    },
    onSubmit: ({ value }) => options.onSubmit(value),
  })
}
