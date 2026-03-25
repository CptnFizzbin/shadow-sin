import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { SinData } from "#/lib/system/types/gear/SinData.ts"
import {
  getSinAvailability,
  getSinCost,
} from "#/lib/system/types/gear/SinUtils.ts"
import { GearType } from "#/lib/system/types/gear/gearData.ts"
import type { VerificationData } from "#/lib/system/types/gear/licenseData.ts"
import { VerificationKind } from "#/lib/system/types/gear/licenseData.ts"

export type SinEditFormOptions = {
  mode: "edit"
  sin: SinData
  onSubmit: (sin: SinData) => void
}

export type SinCreateFormOptions = {
  mode: "create"
  allowReal?: boolean
  onSubmit: (sin: SinData) => void
}

export type SinFormOptions = SinEditFormOptions | SinCreateFormOptions

const defaultFormValues: SinData = {
  id: "",
  name: "",
  type: GearType.sin,
  verification: { kind: VerificationKind.Fake, rating: 1 },
  cost: 0,
  licenses: [],
}

export const sinFieldMap = createFieldMap(defaultFormValues)

export const sinFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useSinForm = (options: SinFormOptions) => {
  const { mode } = options

  let defaultVals: typeof defaultFormValues

  if (mode === "edit") {
    defaultVals = { ...defaultFormValues, ...options.sin }
  } else {
    const verification: VerificationData = options.allowReal
      ? { kind: VerificationKind.Real }
      : { kind: VerificationKind.Fake, rating: 1 }
    defaultVals = {
      ...defaultFormValues,
      id: crypto.randomUUID(),
      verification,
      cost: getSinCost(verification),
    }
  }

  return useAppForm({
    ...sinFormOpts,
    defaultValues: defaultVals,
    onSubmit: ({ value }) => {
      options.onSubmit({
        ...value,
        cost: getSinCost(value.verification),
        availability: getSinAvailability(value.verification),
      })
    },
  })
}
