import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { NullGearId } from "#/components/gear/gearUtils.ts"
import { getSinCost } from "#/components/licenses/sinUtils.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export interface SinFormOptions {
  sin?: SinData
  onSubmit: (sin: SinData, meta: GearSubmitMeta) => void
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
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => {
      const rating: "real" | number =
        value.rating === "real" ? "real" : Number(value.rating)

      options.onSubmit({
        ...value,
        rating: rating,
        cost: getSinCost(rating),
      }, meta)
    },
  })
}
