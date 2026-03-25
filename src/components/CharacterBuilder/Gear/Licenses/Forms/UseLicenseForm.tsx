import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import {
  getLicenseAvailability,
  getLicenseCost,
} from "#/lib/system/types/gear/SinUtils.ts"
import { GearType } from "#/lib/system/types/gear/gearData.ts"
import type {
  LicenseData,
  VerificationData,
} from "#/lib/system/types/gear/licenseData.ts"
import { VerificationKind } from "#/lib/system/types/gear/licenseData.ts"

export type LicenseEditFormOptions = {
  mode: "edit"
  license: LicenseData
  onSubmit: (data: LicenseData) => void
}

export type LicenseCreateFormOptions = {
  mode: "create"
  sinReal: boolean
  onSubmit: (data: LicenseData) => void
}

export type LicenseFormOptions =
  | LicenseEditFormOptions
  | LicenseCreateFormOptions

const defaultFormValues: LicenseData = {
  id: "",
  name: "",
  type: GearType.license,
  verification: { kind: VerificationKind.Fake, rating: 1 },
  cost: 0,
}

export const licenseFieldMap = createFieldMap(defaultFormValues)

export const licenseFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useLicenseForm = (options: LicenseFormOptions) => {
  const { mode } = options

  let initialValues: typeof defaultFormValues

  if (mode === "edit") {
    initialValues = { ...defaultFormValues, ...options.license }
  } else {
    const verification: VerificationData = options.sinReal
      ? { kind: VerificationKind.Real }
      : { kind: VerificationKind.Fake, rating: 1 }
    initialValues = {
      ...defaultFormValues,
      id: crypto.randomUUID(),
      verification,
      cost: getLicenseCost(verification),
    }
  }

  return useAppForm({
    ...licenseFormOpts,
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      options.onSubmit({
        ...value,
        cost: getLicenseCost(value.verification),
        availability: getLicenseAvailability(value.verification),
      })
    },
  })
}
