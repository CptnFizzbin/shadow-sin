import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { ProgramData } from "#/lib/system/gear/programData.ts"
import { ProgramType } from "#/lib/system/gear/programData.ts"
import { ItemType } from "#/lib/system/itemType.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export interface ProgramFormOptions {
  program?: ProgramData
  parentId?: UUID
  onSubmit: (program: ProgramData, meta: GearSubmitMeta) => void
}

const defaultFormValues: ProgramData = {
  id: NullUuid,
  itemType: ItemType.program,
  name: "",
  cost: 0,
  quantity: 1,
  description: "",
  rating: 0,
  programType: ProgramType.other,
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  effects: [],
}

export const programFieldMap = createFieldMap(defaultFormValues)

export const programFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useProgramForm = ({ program, parentId, onSubmit }: ProgramFormOptions) => {
  return useAppForm({
    ...programFormOpts,
    defaultValues: {
      ...defaultFormValues,
      parentId,
      ...program,
    },
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit(value, meta),
  })
}
