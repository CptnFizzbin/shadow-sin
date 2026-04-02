import { revalidateLogic } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { TraditionData } from "#/lib/system/magic/traditionData.ts"
import { TraditionDataSchema } from "#/lib/system/magic/traditionData.ts"

const defaultTraditionValues: TraditionData = {
  name: "",
  spiritTypes: {
    combat: "",
    detection: "",
    health: "",
    illusion: "",
    manipulation: "",
  },
  drainAttribute: AttributeKey.logic,
  concept: "",
}

export type TraditionFormOptions = {
  tradition?: TraditionData
  onSubmit: (tradition: TraditionData) => void
}

export function useTraditionForm({ tradition, onSubmit }: TraditionFormOptions) {
  return useAppForm({
    defaultValues: {
      ...defaultTraditionValues,
      ...tradition,
    },
    onSubmit: ({ value }) => onSubmit(value),
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: TraditionDataSchema,
    },
  })
}

export type TraditionForm = ReturnType<typeof useTraditionForm>
