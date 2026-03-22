import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { GearType } from "#/lib/system/types/gear/gearData.ts"
import type { ImplantData } from "#/lib/system/types/gear/implantData.ts"
import {
  ImplantLocation,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"

export type CyberwareFormState = Omit<ImplantData, "items">

export type CyberwareEditFormOptions = {
  mode: "edit"
  cyberware: CyberwareFormState
  onSubmit: (cyberware: CyberwareFormState) => void
}

export type CyberwareCreateFormOptions = {
  mode: "create"
  onSubmit: (cyberware: CyberwareFormState) => void
}

export type CyberwareFormOptions =
  | CyberwareEditFormOptions
  | CyberwareCreateFormOptions

const defaultFormValues: CyberwareFormState = {
  id: "",
  name: "",
  type: GearType.implant,
  implantType: ImplantType.cyberware,
  location: ImplantLocation.torso,
  essenceCost: 0,
}

export const cyberwareFieldMap = createFieldMap(defaultFormValues)

export const cyberwareFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useCyberwareForm = (options: CyberwareFormOptions) => {
  const defaultValues: CyberwareFormState =
    options.mode === "edit"
      ? {
          ...defaultFormValues,
          ...options.cyberware,
        }
      : {
          ...defaultFormValues,
          id: crypto.randomUUID(),
        }

  return useAppForm({
    ...cyberwareFormOpts,
    defaultValues: defaultValues,
    onSubmit: ({ value }) => options.onSubmit(value),
  })
}
