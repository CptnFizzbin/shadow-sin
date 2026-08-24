import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { DefaultFakeLicenseRating, getLicenseCost } from "#/components/items/types/licenses/licenseUtils.ts"
import { useItemForm, itemDefaults } from "#/hooks/items/forms/useItemForm.tsx"
import type { UUID } from "#/lib/uuidUtils.ts"
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
  items: { parentId: NullUuid, childIds: [] },
}

export const useLicenseForm = ({ parentId, license, onSubmit }: LicenseFormOptions) => {
  return useItemForm<LicenseData>({
    item: license,
    defaultValues: { ...defaultValues, items: { ...defaultValues.items, parentId: parentId ?? null } },
    onSubmit: (value, meta) => {
      onSubmit({ ...value, cost: getLicenseCost(value.rating) }, meta)
    },
  })
}
