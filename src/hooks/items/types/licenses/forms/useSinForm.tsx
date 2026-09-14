import type { GearSubmitMeta } from "#/components/entities/items/gearSubmitMeta.ts"
import { getSinCost } from "#/components/entities/items/types/licenses/sinUtils.ts"
import { useItemForm, itemDefaults } from "#/hooks/items/forms/useItemForm.tsx"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

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
