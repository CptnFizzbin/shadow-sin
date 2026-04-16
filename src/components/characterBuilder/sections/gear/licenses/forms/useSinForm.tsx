import { createFieldMap, formOptions } from "@tanstack/form-core"

import { getSinCost } from "#/components/characterBuilder/sections/gear/licenses/sinUtils.ts"
import { NullGearId } from "#/components/gear/gearUtils.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export interface SinFormOptions {
  sin?: SinData
  onSubmit: (sin: SinData) => void
}

const defaultValues: SinData = {
  itemType: ItemType.sin,
  id: NullGearId,
  name: "",
  rating: 1,
}

export const sinFieldMap = createFieldMap(defaultValues)

export const sinFormOpts = formOptions({
  defaultValues,
})

export const useSinForm = (options: SinFormOptions) => {
  return useAppForm({
    ...sinFormOpts,
    defaultValues: {
      ...defaultValues,
      ...options.sin,
    },
    onSubmit: ({ value }) => {
      const rating: "real" | number =
        value.rating === "real" ? "real" : Number(value.rating)

      options.onSubmit({
        ...value,
        rating: rating,
        cost: getSinCost(rating),
      })
    },
  })
}
