import type { UUID } from "#common/uuid/uuidUtils.ts"
import { NullUuid } from "#common/uuid/uuidUtils.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import type { QualityData } from "#data/qualities/qualityData.ts"
import { useAppForm } from "#forms/tanstackForm/useAppForm.ts"

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
