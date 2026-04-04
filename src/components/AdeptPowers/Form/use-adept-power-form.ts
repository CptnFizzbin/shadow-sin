import { useAppForm } from "#/integrations/tanstack-form/use-app-form.ts"
import type { AdeptPowerData } from "#/lib/system/magic/adept-power-data.ts"
import { AdeptPowerDataSchema } from "#/lib/system/magic/adept-power-data.ts"
import { NullUuid } from "#/lib/uuid-utils.ts"

export type AdeptPowerFormOptions =
  | { mode: "create", onSubmit: (values: AdeptPowerData) => void }
  | {
    mode: "edit"
    power: AdeptPowerData
    onSubmit: (values: AdeptPowerData) => void
  }

const defaultAdeptPowerValues: AdeptPowerData = {
  id: NullUuid,
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
 * Create and configure a form controller for creating or editing an AdeptPowerData entry.
 *
 * @param props - Options controlling form mode and submit handler. When `mode` is `"edit"`, the form's default values are the file defaults merged with `props.power`; when `mode` is `"create"`, the form's default values use the file defaults with id set to NullUuid.
 * @returns The form controller configured for `AdeptPowerData`, including default values, change-time validation, and an `onSubmit` handler that forwards the form value to the provided callback.
 */
export function useAdeptPowerForm(props: AdeptPowerFormOptions) {
  const defaultValues =
    props.mode === "edit"
      ? {
          ...defaultAdeptPowerValues,
          ...props.power,
        }
      : defaultAdeptPowerValues

  return useAppForm({
    defaultValues,
    onSubmit: ({ value }) => props.onSubmit(value),
    validators: {
      onChange: AdeptPowerDataSchema,
    },
  })
}

export type AdeptPowerForm = ReturnType<typeof useAdeptPowerForm>
