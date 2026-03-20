import { createFieldMap, formOptions } from "@tanstack/form-core"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export type GearItemRestriction = "none" | "restricted" | "forbidden"

export type GearItemEditFormOptions = {
  mode: "edit"
  item: GearItemFormState
  onSubmit: (item: GearItemFormState) => void
}

export type GearItemCreateFormOptions = {
  mode: "create"
  onSubmit: (item: GearItemFormState) => void
}

export type GearItemFormOptions =
  | GearItemEditFormOptions
  | GearItemCreateFormOptions

const defaultFormValues = {
  id: "",
  name: "",
  cost: 0,
  description: "",
  availabilityRating: 0,
  restriction: "none" as GearItemRestriction,
  sourceBook: "",
  sourcePage: 0,
}

export const gearItemFieldMap = createFieldMap(defaultFormValues)

export const gearItemFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

function restrictionFromAvailability(
  availability: AvailablityInfo | undefined,
): GearItemRestriction {
  if (availability?.forbidden) return "forbidden"
  if (availability?.restricted) return "restricted"
  return "none"
}

export const useGearItemForm = (options: GearItemFormOptions) => {
  const defaults: typeof defaultFormValues =
    options.mode === "edit"
      ? {
          id: options.item.id,
          name: options.item.name,
          cost: options.item.cost,
          description: options.item.description ?? "",
          availabilityRating: options.item.availability?.rating ?? 0,
          restriction: restrictionFromAvailability(options.item.availability),
          sourceBook: options.item.source?.book ?? "",
          sourcePage: options.item.source?.page ?? 0,
        }
      : { ...defaultFormValues, id: crypto.randomUUID() }

  return useAppForm({
    ...gearItemFormOpts,
    defaultValues: defaults,
    onSubmit: ({ value }) => {
      const availability: AvailablityInfo | undefined =
        value.availabilityRating > 0
          ? {
              rating: value.availabilityRating,
              restricted: value.restriction === "restricted",
              forbidden: value.restriction === "forbidden",
            }
          : undefined

      const source: SourceData | undefined = value.sourceBook
        ? { book: value.sourceBook, page: value.sourcePage ?? 0 }
        : undefined

      options.onSubmit({
        id: value.id,
        name: value.name,
        cost: value.cost ?? 0,
        description: value.description || undefined,
        availability,
        source,
      })
    },
  })
}
