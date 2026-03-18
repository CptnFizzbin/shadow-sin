import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import {
  type QualityData,
  QualityDataSchema,
} from "#/lib/system/types/qualityData.ts"
import type { SourceData } from "#/lib/system/types/sourceData.ts"

export interface QualityFormState {
  id?: string
  name: string
  type: "positive" | "negative"
  bpValue?: number
  description: string
  source?: SourceData
}

export type QualityFormOptions = { onSubmit: (values: QualityData) => void } & (
  | { mode: "create" }
  | { mode: "edit"; quality: QualityData }
)

export function useQualityForm(props: QualityFormOptions) {
  let defaultValues: QualityFormState

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
