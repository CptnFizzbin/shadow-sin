import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { UUID } from "#common/uuid/uuidUtils.ts"
import { NullUuid } from "#common/uuid/uuidUtils.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import type { AgentData } from "#data/items/agentData.ts"
import { ItemState } from "#data/items/itemState.ts"
import { ItemType } from "#data/items/itemType.ts"
import { ProgramType } from "#data/items/programData.ts"
import type { GearSubmitMeta } from "#forms/items/gearSubmitMeta.ts"
import { useItemForm } from "#forms/items/useItemForm.tsx"

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
  state: ItemState.available,
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
