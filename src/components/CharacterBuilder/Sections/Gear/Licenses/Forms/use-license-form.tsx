import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import { getLicenseCost } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/license-utils.ts"
import { NullGearId } from "#/components/Gear/gear-utils.ts"
import { useAppForm } from "#/integrations/tanstack-form/use-app-form.ts"
import type { LicenseData } from "#/lib/system/gear/license-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

export interface LicenseFormOptions {
  parentId?: UUID
  license?: LicenseData
  sinReal: boolean
  onSubmit: (data: LicenseData) => void
}

const defaultValues: LicenseData = {
  itemType: GearType.license,
  id: NullGearId,
  name: "",
  rating: 1,
  cost: 0,
  parentId: NullGearId,
}

export const licenseFieldMap = createFieldMap(defaultValues)

export const licenseFormOpts = formOptions({
  defaultValues,
})

export const useLicenseForm = ({ parentId, license, onSubmit }: LicenseFormOptions) => {
  return useAppForm({
    ...licenseFormOpts,
    defaultValues: {
      ...defaultValues,
      parentId: parentId,
      ...license,
    },
    onSubmit: ({ value }) => {
      onSubmit({
        ...value,
        cost: getLicenseCost(value.rating),
      })
    },
  })
}
