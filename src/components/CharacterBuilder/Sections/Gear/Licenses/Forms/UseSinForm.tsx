import { createFieldMap, formOptions } from "@tanstack/form-core"

import { getSinCost } from "#/components/CharacterBuilder/Sections/Gear/Licenses/SinUtils.ts"
import { NullGearId } from "#/components/Gear/GearUtils.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { SinData } from "#/lib/system/gear/SinData.ts"
import { GearType } from "#/lib/system/gearType.ts"

export interface SinFormOptions {
  sin?: SinData
  onSubmit: (sin: SinData) => void
}

const defaultValues: SinData = {
  itemType: GearType.sin,
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
      id: crypto.randomUUID(),
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
