import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/entities/items/gearSubmitMeta.ts"
import { useItemForm } from "#/hooks/items/forms/useItemForm.tsx"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

interface AgentFormOptions {
  agent?: AgentData
  parentId?: UUID
  onSubmit: (agent: AgentData, meta: GearSubmitMeta) => void
}

const defaultFormValues: AgentData = {
  kind: EntityKind.item,
  id: NullUuid,
  itemType: ItemType.program,
  name: "",
  cost: 0,
  quantity: 1,
  description: "",
  rating: 0,
  programType: ProgramType.agent,
  attributes: {},
  damage: { matrix: 0 },
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  items: { parentId: null, childIds: [] },
  effects: [],
  stashed: false,
}

export const agentFieldMap = createFieldMap(defaultFormValues)

export const agentFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useAgentForm = ({ agent, parentId, onSubmit }: AgentFormOptions) => {
  return useItemForm<AgentData>({
    item: agent,
    defaultValues: {
      ...defaultFormValues,
      items: { ...defaultFormValues.items, parentId: parentId ?? null },
    },
    onSubmit,
  })
}
