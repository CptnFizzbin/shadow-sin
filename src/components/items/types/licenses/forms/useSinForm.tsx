import { useItemForm, itemDefaults } from "#/components/items/forms/useItemForm.tsx"
import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { getSinCost } from "#/components/items/types/licenses/sinUtils.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"

interface SinFormOptions {
  sin?: SinData
  onSubmit: (sin: SinData, meta: GearSubmitMeta) => void
}

const defaultValues: SinData = {
  ...itemDefaults,
  itemType: ItemType.sin,
  id: NullUuid,
  name: "",
  rating: 1,
}

export const useSinForm = ({ sin, onSubmit }: SinFormOptions) => {
  return useItemForm<SinData>({
    item: sin,
    defaultValues,
    onSubmit: (value, meta) => {
      const rating: "real" | number = value.rating === "real" ? "real" : Number(value.rating)
      onSubmit({ ...value, rating, cost: getSinCost(rating) }, meta)
    },
  })
}
