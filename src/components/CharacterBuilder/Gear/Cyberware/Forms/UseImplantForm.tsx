import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { ImplantGrade, ImplantType } from "#/lib/system/gear/implantData.ts"

export type ImplantEditFormOptions = {
  mode: "edit"
  implant: ImplantFormState
  onSubmit: (implant: ImplantFormState) => void
}

export type ImplantCreateFormOptions = {
  mode: "create"
  onSubmit: (implant: ImplantFormState) => void
}

export type ImplantFormOptions =
  | ImplantEditFormOptions
  | ImplantCreateFormOptions

const defaultFormValues: ImplantFormState = {
  id: "",
  name: "",
  cost: 0,
  essenceCost: 0,
  grade: ImplantGrade.standard,
  implantType: ImplantType.cyberware,
  location: "",
  description: "",
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
