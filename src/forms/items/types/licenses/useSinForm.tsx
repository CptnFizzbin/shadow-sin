import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { SinData } from "#/data/items/sinData.ts"
import type { GearSubmitMeta } from "#/forms/items/gearSubmitMeta.ts"
import { useItemForm, itemDefaults } from "#/forms/items/useItemForm.tsx"
import { getSinCost } from "#/rules/items/sinUtils.ts"

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
