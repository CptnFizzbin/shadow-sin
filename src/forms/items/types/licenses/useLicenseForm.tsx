import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { LicenseData } from "#/data/items/licenseData.ts"
import type { GearSubmitMeta } from "#/forms/items/gearSubmitMeta.ts"
import { useItemForm, itemDefaults } from "#/forms/items/useItemForm.tsx"
import { DefaultFakeLicenseRating, getLicenseCost } from "#/rules/items/licenseUtils.ts"

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
  isReal: false,
  rating: DefaultFakeLicenseRating,
  cost: 0,
  items: { parentId: NullUuid, childIds: [] },
}

export const useLicenseForm = ({ parentId, license, onSubmit }: LicenseFormOptions) => {
  return useItemForm<LicenseData>({
    item: license,
    defaultValues: { ...defaultValues, items: { ...defaultValues.items, parentId: parentId ?? null } },
    onSubmit: (value, meta) => {
      const cost = getLicenseCost(value.isReal, value.rating ?? 0)
      onSubmit({ ...value, rating: value.isReal ? undefined : value.rating, cost }, meta)
    },
  })
}
