import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { getLicenseCost } from "#/components/licenses/licenseUtils.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface LicenseFormOptions {
  parentId?: UUID
  license?: LicenseData
  sinReal: boolean
  onSubmit: (data: LicenseData, meta: GearSubmitMeta) => void
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
  return useItemForm<LicenseData>({
    item: license,
    defaultValues: { ...defaultValues, parentId },
    onSubmit: (value, meta) => {
      onSubmit({ ...value, cost: getLicenseCost(value.rating) }, meta)
    },
  })
}
