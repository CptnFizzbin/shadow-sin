import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { getItemState, getItemStateActions, isItemStateWithinParent, ItemStateAction, itemStateActionTargets } from "./itemStateRules.ts"

/** The state actions the gear list's bulk action bar applies to every selected Item at once. */
export type ItemBulkStateAction =
  | ItemStateAction.equip
  | ItemStateAction.unequip
  | ItemStateAction.stash
  | ItemStateAction.unstash

/** Every {@link ItemBulkStateAction}, in the order the bulk action bar lists them. */
export const itemBulkStateActions: readonly ItemBulkStateAction[] = [
  ItemStateAction.stash,
  ItemStateAction.unstash,
  ItemStateAction.equip,
  ItemStateAction.unequip,
]

/** The ids of every Attachment under `itemId` in `catalog`, at any depth. */
export function getItemDescendantIds(catalog: ItemCatalog, itemId: UUID): UUID[] {
  const item = catalog[itemId]
  if (!item) return []
  return item.items.childIds.flatMap((childId) => [childId, ...getItemDescendantIds(catalog, childId)])
}

function getItemDepth(catalog: ItemCatalog, item: ItemData): number {
  const parent = item.items.parentId ? catalog[item.items.parentId] : undefined
  return parent ? 1 + getItemDepth(catalog, parent) : 0
}

/** The Items in `catalog` with the given ids, each listed after its parent. Unknown ids are dropped. */
export function orderParentsFirst(catalog: ItemCatalog, ids: readonly UUID[]): ItemData[] {
  return ids
    .map((id) => catalog[id])
    .filter((item): item is ItemData => !!item)
    .map((item) => ({ item, depth: getItemDepth(catalog, item) }))
    .sort((left, right) => left.depth - right.depth)
    .map(({ item }) => item)
}

/**
 * Whether `action` applies to the Item at `itemId` in `catalog` right now: the Item offers it (e.g.
 * Equip only on an Item whose type can be Equipped) and its parent, if any, is at least as present
 * as the state the action moves it into.
 */
export function canApplyBulkStateAction(catalog: ItemCatalog, itemId: UUID, action: ItemBulkStateAction): boolean {
  const item = catalog[itemId]
  if (!item || !getItemStateActions(item).includes(action)) return false
  const parent = item.items.parentId ? catalog[item.items.parentId] : undefined
  return isItemStateWithinParent(itemStateActionTargets[action], parent ? getItemState(parent) : undefined)
}

/**
 * Whether the Item at `itemId` in `catalog` can be removed on its own. A fixed Attachment is part
 * of its parent, so it only goes when its parent does.
 */
export function canRemoveItemOnItsOwn(catalog: ItemCatalog, itemId: UUID): boolean {
  const item = catalog[itemId]
  return !!item && !(item.items.parentId && item.fixed)
}
