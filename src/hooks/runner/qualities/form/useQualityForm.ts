import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { QualityData } from "#/system/model/qualities/qualityData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

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
