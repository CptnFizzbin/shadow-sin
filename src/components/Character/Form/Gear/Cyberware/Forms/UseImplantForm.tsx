import { createFieldMap, formOptions } from "@tanstack/form-core"

import type {
  ImplantFormRestriction,
  ImplantFormState,
} from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"
import { defaultImplantFormValues } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"
import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export type ImplantEditFormOptions = {
  mode: "edit"
  implant: ImplantFormState
  onSubmit: (implant: ImplantFormState) => void
}

export type ImplantCreateFormOptions = {
  mode: "create"
  onSubmit: (implant: ImplantFormState) => void
}

export type ImplantFormOptions =
  | ImplantEditFormOptions
  | ImplantCreateFormOptions

const defaultFormValues = { ...defaultImplantFormValues }

export const implantFieldMap = createFieldMap(defaultFormValues)

export const implantFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

function restrictionFromAvailability(
  availability: AvailablityInfo | undefined,
): ImplantFormRestriction {
  if (!availability) return "none"
  if (availability.forbidden) return "forbidden"
  if (availability.restricted) return "restricted"
  return "none"
}

export const useImplantForm = (options: ImplantFormOptions) => {
  const defaults =
    options.mode === "edit"
      ? {
          ...defaultFormValues,
          ...options.implant,
          availabilityRating: options.implant.availability?.rating ?? 0,
          restriction: restrictionFromAvailability(
            options.implant.availability,
          ),
          sourceBook: options.implant.source?.book ?? "",
          sourcePage: options.implant.source?.page ?? 0,
        }
      : { ...defaultFormValues, id: crypto.randomUUID() }

  return useAppForm({
    ...implantFormOpts,
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
        essenceCost: value.essenceCost ?? 0,
        grade: value.grade,
        implantType: value.implantType,
        location: value.location,
        description: value.description || undefined,
        availability,
        source,
      })
    },
  })
}
