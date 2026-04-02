import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { AdeptPowerData } from "#/lib/system/magic/adeptPowerData.ts"
import { AdeptPowerDataSchema } from "#/lib/system/magic/adeptPowerData.ts"

export type AdeptPowerFormOptions =
  | { mode: "create", onSubmit: (values: AdeptPowerData) => void }
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
  effects: [],
}

/**
 * Create form state and handlers for creating or editing an AdeptPowerData record.
 *
 * @param props - Configuration for the form. When `mode` is `"create"`, the form is initialized with default values and a newly generated `id`; when `mode` is `"edit"`, the form is initialized with the provided `power`. In both modes `onSubmit` is called with the `AdeptPowerData` value when the form is submitted.
 * @returns The form controller object exposing current values, validation state, and a submit handler for an AdeptPowerData form.
 */
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
