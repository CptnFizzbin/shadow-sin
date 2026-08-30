import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { DefaultFakeLicenseRating, getLicenseCost } from "#/components/items/types/licenses/licenseUtils.ts"
import { useItemForm, itemDefaults } from "#/hooks/items/forms/useItemForm.tsx"
import type { UUID } from "#/lib/uuidUtils.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

interface LicenseFormOptions {
  parentId?: UUID
  license?: LicenseData
  onSubmit: (data: LicenseData, meta: GearSubmitMeta) => void
}

/**
 * Flat editing shape for the License form. `isReal` carries through unchanged from an edited
 * Licence — this form has no [Real | Fake] toggle of its own (only `AssignLicenseDialog` ever
 * creates a Real Licence, matching its SIN) — while `rating` backs the form's numeric counter.
 * Converted to `LicenseData`'s `isReal`-discriminated union only at submit time.
 */
export interface LicenseFormValues extends ItemData {
  itemType: ItemType.license
  isReal: boolean
  rating: number
}

const defaultValues: LicenseFormValues = {
  ...itemDefaults,
  itemType: ItemType.license,
  id: NullUuid,
  name: "",
  isReal: false,
  rating: DefaultFakeLicenseRating,
  cost: 0,
  items: { parentId: NullUuid, childIds: [] },
}

function toLicenseData(value: LicenseFormValues): LicenseData {
  if (value.isReal) {
    const { rating: _rating, ...rest } = value
    return { ...rest, isReal: true }
  }
  return { ...value, isReal: false, rating: value.rating }
}

export const useLicenseForm = ({ parentId, license, onSubmit }: LicenseFormOptions) => {
  const item: LicenseFormValues | undefined = license
    ? { ...license, isReal: license.isReal, rating: license.isReal ? DefaultFakeLicenseRating : license.rating }
    : undefined

  return useItemForm<LicenseFormValues>({
    item,
    defaultValues: { ...defaultValues, items: { ...defaultValues.items, parentId: parentId ?? null } },
    onSubmit: (value, meta) => {
      const cost = getLicenseCost(value.isReal, value.rating)
      onSubmit({ ...toLicenseData(value), cost }, meta)
    },
  })
}
