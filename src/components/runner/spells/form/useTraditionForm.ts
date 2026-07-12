import { revalidateLogic } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"
import { SpiritType, TraditionDataSchema } from "#/system/magic/traditionData.ts"

const defaultTraditionValues: TraditionData = {
  name: "",
  spiritTypes: {
    combat: SpiritType.fire,
    detection: SpiritType.fire,
    health: SpiritType.fire,
    illusion: SpiritType.fire,
    manipulation: SpiritType.fire,
  },
  drainAttribute: AttributeKey.logic,
  concept: "",
}

type TraditionFormOptions = {
  tradition?: TraditionData | null
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
