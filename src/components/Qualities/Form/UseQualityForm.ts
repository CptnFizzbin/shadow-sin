import { useMemo } from "react"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"
import { QualityDataSchema } from "#/lib/system/qualityData.ts"

export interface QualityFormOptions {
  quality?: QualityData
  onSubmit: (values: QualityData) => void
}

const defaultFormState: QualityData = {
  id: "",
  name: "",
  type: "positive",
  description: "",
}

export function useQualityForm({ quality, onSubmit }: QualityFormOptions) {
  const defaultValues = useMemo(
    () => ({
      ...defaultFormState,
      ...quality,
    }),
    [quality],
  )

  return useAppForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
    validators: {
      onChange: QualityDataSchema,
    },
  })
}

export type QualityForm = ReturnType<typeof useQualityForm>
