import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { GearType } from "#/lib/system/types/gear/gearData.ts"
import type { ImplantData } from "#/lib/system/types/gear/implantData.ts"
import {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"

export type ImplantEditFormOptions = {
  mode: "edit"
  implant: ImplantData
  onSubmit: (implant: ImplantData) => void
}

export type ImplantCreateFormOptions = {
  mode: "create"
  onSubmit: (implant: ImplantData) => void
}

export type ImplantFormOptions =
  | ImplantEditFormOptions
  | ImplantCreateFormOptions

const defaultFormValues: ImplantData = {
  id: "",
  name: "",
  type: GearType.implant,
  cost: 0,
  essenceCost: 0,
  grade: ImplantGrade.standard,
  implantType: ImplantType.cyberware,
  location: "",
  notes: "",
  availability: undefined,
  source: undefined,
}

export const implantFieldMap = createFieldMap(defaultFormValues)

export const implantFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useImplantForm = (options: ImplantFormOptions) => {
  const defaults =
    options.mode === "edit"
      ? {
          ...defaultFormValues,
          ...options.implant,
        }
      : {
          ...defaultFormValues,
          id: crypto.randomUUID(),
        }

  return useAppForm({
    ...implantFormOpts,
    defaultValues: defaults,
    onSubmit: ({ value }) => options.onSubmit(value),
  })
}
