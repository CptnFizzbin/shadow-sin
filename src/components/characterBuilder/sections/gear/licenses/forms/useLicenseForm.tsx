import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import { getLicenseCost } from "#/components/characterBuilder/sections/gear/licenses/forms/licenseUtils.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface LicenseFormOptions {
  parentId?: UUID
  license?: LicenseData
  sinReal: boolean
  onSubmit: (data: LicenseData) => void
}

const defaultValues: LicenseData = {
  itemType: ItemType.license,
  id: NullUuid,
  name: "",
  rating: 1,
  cost: 0,
  parentId: NullUuid,
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
