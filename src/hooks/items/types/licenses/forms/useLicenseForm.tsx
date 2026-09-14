import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { DefaultFakeLicenseRating, getLicenseCost } from "#/components/items/types/licenses/licenseUtils.ts"
import { useItemForm, itemDefaults } from "#/hooks/items/forms/useItemForm.tsx"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

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
