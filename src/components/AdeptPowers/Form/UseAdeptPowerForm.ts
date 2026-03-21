import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { AdeptPowerData } from "#/lib/system/types/magic/adeptPowerData.ts"
import { AdeptPowerDataSchema } from "#/lib/system/types/magic/adeptPowerData.ts"

export type AdeptPowerFormOptions = {
  onSubmit: (values: AdeptPowerData) => void
} & ({ mode: "create" } | { mode: "edit"; power: AdeptPowerData })

export function useAdeptPowerForm(props: AdeptPowerFormOptions) {
  let defaultValues: AdeptPowerData

  if (props.mode === "edit") {
    defaultValues = props.power
  } else {
    defaultValues = {
      id: crypto.randomUUID(),
      name: "",
      rating: 1,
      costPerRating: 0.5,
      description: "",
    }
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
