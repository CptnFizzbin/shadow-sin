import type { UUID } from "node:crypto"

import type { ItemData } from "#/system/itemData.ts"

export const selectAllGear = (gear: Record<UUID, ItemData>) => gear
