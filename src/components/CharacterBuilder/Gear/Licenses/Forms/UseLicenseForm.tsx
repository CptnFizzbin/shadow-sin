import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import { getLicenseCost } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"

export type LicenseEditFormOptions = {
  mode: "edit"
  license: LicenseFormState
  onSubmit: (data: LicenseFormState) => void
}

export type LicenseCreateFormOptions = {
  mode: "create"
  sinId: string
  sinReal: boolean
  onSubmit: (data: LicenseFormState) => void
}

export type LicenseFormOptions =
  | LicenseEditFormOptions
  | LicenseCreateFormOptions

const defaultValues: LicenseFormState = {
  id: "",
  name: "",
  sinId: "",
  rating: "1",
  cost: getLicenseCost("1"),
}

export const licenseFieldMap = createFieldMap(defaultValues)

export const licenseFormOpts = formOptions({
  defaultValues,
})

export const useLicenseForm = (options: LicenseFormOptions) => {
  const { mode } = options

  let defaultValues: LicenseFormState
  if (mode === "edit") {
    defaultValues = options.license
  } else {
    const rating = options.sinReal ? "real" : "1"

    defaultValues = {
      id: crypto.randomUUID(),
      name: "",
      sinId: options.sinId,
      rating: rating,
      cost: getLicenseCost(rating),
    }
  }

  return useAppForm({
    ...licenseFormOpts,
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      options.onSubmit({
        id: value.id,
        name: value.name,
        sinId: value.sinId,
        rating: value.rating,
        cost: getLicenseCost(value.rating),
      })
    },
  })
}
