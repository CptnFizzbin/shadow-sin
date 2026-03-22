import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { AdeptPowerData } from "#/lib/system/types/magic/adeptPowerData.ts"
import { AdeptPowerDataSchema } from "#/lib/system/types/magic/adeptPowerData.ts"

export type AdeptPowerFormOptions =
  | { mode: "create"; onSubmit: (values: AdeptPowerData) => void }
  | {
      mode: "edit"
      power: AdeptPowerData
      onSubmit: (values: AdeptPowerData) => void
    }

const defualtValues: AdeptPowerData = {
  id: crypto.randomUUID(),
  name: "",
  rating: 1,
  costPerRating: 0.5,
  description: "",
  source: {
    book: "",
    page: 0,
  },
}

export function useAdeptPowerForm(props: AdeptPowerFormOptions) {
  const defaultValues =
    props.mode === "edit"
      ? {
          ...defualtValues,
          ...props.power,
        }
      : {
          ...defualtValues,
          id: crypto.randomUUID(),
        }

  return useAppForm({
    defaultValues,
    onSubmit: ({ value }) => props.onSubmit(value),
    validators: {
      onChange: AdeptPowerDataSchema,
    },
  })
}

export type AdeptPowerForm = ReturnType<typeof useAdeptPowerForm>
