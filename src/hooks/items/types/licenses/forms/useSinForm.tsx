import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { getSinCost } from "#/components/items/types/licenses/sinUtils.ts"
import { useItemForm, itemDefaults } from "#/hooks/items/forms/useItemForm.tsx"
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
  isReal: false,
  rating: 1,
}

export const useSinForm = ({ sin, onSubmit }: SinFormOptions) => {
  return useItemForm<SinData>({
    item: sin,
    defaultValues,
    onSubmit: (value, meta) => {
      const cost = getSinCost(value.isReal, value.rating ?? 0)
      onSubmit({ ...value, rating: value.isReal ? undefined : value.rating, cost }, meta)
    },
  })
}

export type SinForm = ReturnType<typeof useSinForm>
