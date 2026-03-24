import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { getSinCost } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"

export type SinEditFormOptions = {
  mode: "edit"
  sin: SinFormState
  onSubmit: (sin: SinFormState) => void
}

export type SinCreateFormOptions = {
  mode: "create"
  allowReal?: boolean
  onSubmit: (sin: SinFormState) => void
}

export type SinFormOptions = SinEditFormOptions | SinCreateFormOptions

const defaultValues = {
  id: "",
  name: "",
  rating: "1",
  cost: getSinCost(1),
}

export const sinFieldMap = createFieldMap(defaultValues)

export const sinFormOpts = formOptions({
  defaultValues,
})

export const useSinForm = (options: SinFormOptions) => {
  const { mode } = options

  let defaultVals: typeof defaultValues

  if (mode === "edit") {
    const { sin } = options
    defaultVals = {
      id: sin.id,
      name: sin.name,
      rating: sin.rating === "real" ? "real" : String(sin.rating),
      cost: getSinCost(sin.rating === "real" ? "real" : sin.rating),
    }
  } else {
    defaultVals = {
      id: crypto.randomUUID(),
      name: "",
      rating: options.allowReal ? "real" : "1",
      cost: options.allowReal ? getSinCost("real") : getSinCost(1),
    }
  }

  return useAppForm({
    ...sinFormOpts,
    defaultValues: defaultVals,
    onSubmit: ({ value }) => {
      const rating: "real" | number =
        value.rating === "real" ? "real" : Number(value.rating)

      options.onSubmit({
        id: value.id,
        name: value.name,
        rating,
        cost: getSinCost(rating),
      })
    },
  })
}
