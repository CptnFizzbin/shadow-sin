import { createFieldMap, formOptions } from "@tanstack/form-core"

import { getSinCost } from "#/components/characterBuilder/sections/gear/licenses/sinUtils.ts"
import { useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"

export interface SinFormOptions {
  sin?: SinData
  onSubmit: (sin: SinData) => void
}

const defaultValues: SinData = {
  itemType: ItemType.sin,
  id: NullUuid,
  name: "",
  rating: 1,
}

export const sinFieldMap = createFieldMap(defaultValues)

export const sinFormOpts = formOptions({
  defaultValues,
})

export const useSinForm = ({ sin, onSubmit }: SinFormOptions) => {
  return useItemForm<SinData>({
    item: sin,
    defaultValues,
    onSubmit: (value) => {
      const rating: "real" | number = value.rating === "real" ? "real" : Number(value.rating)
      onSubmit({ ...value, rating, cost: getSinCost(rating) })
    },
  })
}
