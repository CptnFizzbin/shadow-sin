import type { UUID } from "node:crypto"

import type { ItemData } from "#/system/itemData.ts"

export const selectAllGear = (gear: Record<UUID, ItemData>) => gear

export const selectGearById = <TItem extends ItemData>(id: UUID) => (gear: Record<UUID, ItemData>) =>
  gear[id] as TItem | undefined

export const selectGearParent = (item: ItemData) => (gear: Record<UUID, ItemData>) => {
  if (!item || !item.parentId) return undefined
  return gear[item.parentId]
}
