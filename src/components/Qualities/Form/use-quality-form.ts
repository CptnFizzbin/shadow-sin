import { useAppForm } from "#/integrations/tanstack-form/use-app-form.ts"
import type { QualityData } from "#/lib/system/quality-data.ts"

export interface QualityFormOptions {
  quality?: QualityData
  onSubmit: (values: QualityData) => void
}

const defaultValues: QualityData = {
  name: "",
  type: "positive",
  description: "",
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
