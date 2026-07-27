import type { UUID } from "node:crypto"

import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { DefaultFakeLicenseRating, getLicenseCost } from "#/components/items/types/licenses/licenseUtils.ts"
import { useItemForm, itemDefaults } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { ItemType } from "#/system/itemType.ts"

interface LicenseFormOptions {
  parentId?: UUID
  license?: LicenseData
  onSubmit: (data: LicenseData, meta: GearSubmitMeta) => void
}

const defaultValues: LicenseData = {
  ...itemDefaults,
  itemType: ItemType.license,
  id: NullUuid,
  name: "",
  rating: DefaultFakeLicenseRating,
  cost: 0,
  parentId: NullUuid,
}

export const useLicenseForm = ({ parentId, license, onSubmit }: LicenseFormOptions) => {
  return useItemForm<LicenseData>({
    item: license,
    defaultValues: { ...defaultValues, parentId },
    onSubmit: (value, meta) => {
      onSubmit({ ...value, cost: getLicenseCost(value.rating) }, meta)
    },
  })
}
