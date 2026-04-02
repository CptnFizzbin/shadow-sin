import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"

export interface QualityFormOptions {
  quality?: QualityData
  onSubmit: (values: QualityData) => void
}

const defaultValues: QualityData = {
  name: "",
  type: "positive",
  description: "",
  effects: [],
}

export function useQualityForm({ quality, onSubmit }: QualityFormOptions) {
  return useAppForm({
    defaultValues: {
      ...defaultValues,
      ...quality,
    },
    onSubmit: ({ value }) => onSubmit(value),
  })
}

export type QualityForm = ReturnType<typeof useQualityForm>
