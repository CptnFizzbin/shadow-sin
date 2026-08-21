import type { UUID } from "node:crypto"

import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { QualityData } from "#/system/qualityData.ts"

interface QualityFormOptions {
  quality?: QualityData
  onSubmit: (values: QualityData) => void
}

const defaultValues: QualityData = {
  kind: EntityKind.quality,
  id: NullUuid,
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
    onSubmit: ({ value }) => {
      const result = { ...value }
      if (result.id === NullUuid) {
        result.id = crypto.randomUUID() as UUID
      }
      onSubmit(result)
    },
  })
}

export type QualityForm = ReturnType<typeof useQualityForm>
