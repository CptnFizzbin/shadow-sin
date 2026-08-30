import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { getSinCost } from "#/components/items/types/licenses/sinUtils.ts"
import { useItemForm, itemDefaults } from "#/hooks/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

interface SinFormOptions {
  sin?: SinData
  onSubmit: (sin: SinData, meta: GearSubmitMeta) => void
}

/**
 * Flat editing shape backing `SinRatingField`'s [Real | Fake] toggle and rating counter.
 * Converted to `SinData`'s `isReal`-discriminated union only at submit time.
 */
export interface SinFormValues extends ItemData {
  itemType: ItemType.sin
  isReal: boolean
  rating: number
}

const defaultValues: SinFormValues = {
  ...itemDefaults,
  itemType: ItemType.sin,
  id: NullUuid,
  name: "",
  isReal: false,
  rating: 1,
}

function toSinData(value: SinFormValues): SinData {
  if (value.isReal) {
    const { rating: _rating, ...rest } = value
    return { ...rest, isReal: true }
  }
  return { ...value, isReal: false, rating: value.rating }
}

export const useSinForm = ({ sin, onSubmit }: SinFormOptions) => {
  const item: SinFormValues | undefined = sin
    ? { ...sin, isReal: sin.isReal, rating: sin.isReal ? defaultValues.rating : sin.rating }
    : undefined

  return useItemForm<SinFormValues>({
    item,
    defaultValues,
    onSubmit: (value, meta) => {
      const cost = getSinCost(value.isReal, value.rating)
      onSubmit({ ...toSinData(value), cost }, meta)
    },
  })
}

export type SinForm = ReturnType<typeof useSinForm>
