import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"
import { QualityDataSchema } from "#/lib/system/types/qualityData.ts"

export type QualityFormOptions = { onSubmit: (values: QualityData) => void } & (
  | { mode: "create" }
  | { mode: "edit"; quality: QualityData }
)

export function useQualityForm(props: QualityFormOptions) {
  let defaultValues: QualityData

  if (props.mode === "edit") {
    const { quality } = props
    defaultValues = quality
  } else {
    defaultValues = {
      id: crypto.randomUUID(),
      name: "",
      type: "positive",
      description: "",
    }
  }

  return useAppForm({
    defaultValues,
    onSubmit: ({ value }) => props.onSubmit(value),
    validators: {
      onChange: QualityDataSchema,
    },
  })
}

export type QualityForm = ReturnType<typeof useQualityForm>
