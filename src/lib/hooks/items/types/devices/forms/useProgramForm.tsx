import type { UUID } from "node:crypto"

import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { useItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ProgramType } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

interface ProgramFormOptions {
  program?: ProgramData
  parentId?: UUID
  onSubmit: (program: ProgramData, meta: GearSubmitMeta) => void
}

const defaultFormValues: ProgramData = {
  kind: EntityKind.item,
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
  stashed: false,
}

export const programFieldMap = createFieldMap(defaultFormValues)

export const programFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useProgramForm = ({ program, parentId, onSubmit }: ProgramFormOptions) => {
  return useItemForm<ProgramData>({
    item: program,
    defaultValues: { ...defaultFormValues, parentId },
    onSubmit,
  })
}
