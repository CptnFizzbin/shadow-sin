import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

/** A Rating 3 / System 4 / Firewall 2 Agent named "Griffin", with a fresh id unless overridden. */
export const makeAgent = (overrides: Partial<AgentData> = {}): AgentData => ({
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: crypto.randomUUID() as UUID,
  name: "Griffin",
  itemType: ItemType.program,
  programType: ProgramType.agent,
  rating: 3,
  attributes: { system: 4, firewall: 2 },
  damage: { matrix: 0 },
  ...overrides,
})
