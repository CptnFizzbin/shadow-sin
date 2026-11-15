import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemState, itemStatesByType } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"

/** The state `item` is in; an Item with no stored state is Available. */
export function getItemState(item: Pick<ItemData, "state">): ItemState {
  return item.state ?? ItemState.available
}

/** The states an Item of `itemType` can be in, most active first. */
export function getAllowedItemStates(itemType: ItemType): readonly ItemState[] {
  return itemStatesByType[itemType] ?? [ItemState.available, ItemState.stashed]
}

/** Whether an Item of `itemType` can be in `state`. */
function isItemStateAllowed(itemType: ItemType, state: ItemState): boolean {
  return getAllowedItemStates(itemType).includes(state)
}

/** Whether `state` is one in which an Item's Game Effects apply (Equipped, Implanted, or Active). */
function isActiveItemState(state: ItemState): boolean {
  return state === ItemState.equipped || state === ItemState.implanted || state === ItemState.active
}

/** The active state an Item of `itemType` can be in (Equipped, Implanted, or Active), if it has one. */
export function getActiveItemState(itemType: ItemType): ItemState | undefined {
  return getAllowedItemStates(itemType).find(isActiveItemState)
}

/** Whether `item` is Equipped, Implanted, or Active — the only states in which its Game Effects apply. */
export function isItemActive(item: Pick<ItemData, "state">): boolean {
  return isActiveItemState(getItemState(item))
}

/** Whether `item` is On Hand: anything but Stashed. */
export function isItemOnHand(item: Pick<ItemData, "state">): boolean {
  return getItemState(item) !== ItemState.stashed
}

/** Whether `item` is Stashed. */
export function isItemStashed(item: Pick<ItemData, "state">): boolean {
  return getItemState(item) === ItemState.stashed
}

/** Whether `item` is Equipped specifically (not Implanted). */
export function isItemEquipped(item: Pick<ItemData, "state">): boolean {
  return getItemState(item) === ItemState.equipped
}

/** Whether `item` is Implanted specifically (not Equipped). */
export function isItemImplanted(item: Pick<ItemData, "state">): boolean {
  return getItemState(item) === ItemState.implanted
}

/** The on-screen label for `state` on an Item of `itemType`. Programs and Software call Available "Loaded". */
export function getItemStateLabel(itemType: ItemType, state: ItemState): string {
  switch (state) {
    case ItemState.equipped:
      return "Equipped"
    case ItemState.implanted:
      return "Implanted"
    case ItemState.active:
      return "Active"
    case ItemState.stashed:
      return "Stashed"
    case ItemState.available:
      return itemType === ItemType.program || itemType === ItemType.software ? "Loaded" : "Available"
  }
}

/** A named move between Item States, as offered in an Item's action menu. */
export enum ItemStateAction {
  equip = "equip",
  unequip = "unequip",
  implant = "implant",
  extract = "extract",
  stash = "stash",
  unstash = "unstash",
  /** Use up one unit of a Consumable, making it Active. */
  consume = "consume",
  /** End an Active Consumable's effects. */
  endEffect = "endEffect",
}

/** The state each {@link ItemStateAction} moves an Item into. */
export const itemStateActionTargets: Record<ItemStateAction, ItemState> = {
  [ItemStateAction.equip]: ItemState.equipped,
  [ItemStateAction.unequip]: ItemState.available,
  [ItemStateAction.implant]: ItemState.implanted,
  [ItemStateAction.extract]: ItemState.available,
  [ItemStateAction.stash]: ItemState.stashed,
  [ItemStateAction.unstash]: ItemState.available,
  [ItemStateAction.consume]: ItemState.active,
  [ItemStateAction.endEffect]: ItemState.available,
}

/** Whether `item` has a unit left to Consume. An Item with no stored quantity has one. */
export function hasUnitsToConsume(item: Pick<ItemData, "quantity">): boolean {
  return (item.quantity ?? 1) >= 1
}

/** The action that moves an Available Item of `itemType` into its active state, if it has one. */
function getActivateAction(item: Pick<ItemData, "itemType" | "quantity">): ItemStateAction[] {
  switch (getActiveItemState(item.itemType)) {
    case ItemState.equipped:
      return [ItemStateAction.equip]
    case ItemState.implanted:
      return [ItemStateAction.implant]
    case ItemState.active:
      return hasUnitsToConsume(item) ? [ItemStateAction.consume] : []
    default:
      return []
  }
}

/**
 * The actions an Item's action menu offers, given its type, current state, and (for a Consumable)
 * how many units it has left. A Stashed Item only offers Unstash — the Player Unstashes before
 * Equipping, Implanting, or Consuming it. An Active Consumable only offers End Effect, since what's
 * already been taken can't be put away.
 */
export function getItemStateActions(item: Pick<ItemData, "itemType" | "state" | "quantity">): ItemStateAction[] {
  switch (getItemState(item)) {
    case ItemState.available:
      return [...getActivateAction(item), ItemStateAction.stash]
    case ItemState.equipped:
      return [ItemStateAction.unequip, ItemStateAction.stash]
    case ItemState.implanted:
      return [ItemStateAction.extract, ItemStateAction.stash]
    case ItemState.active:
      return [ItemStateAction.endEffect]
    case ItemState.stashed:
      return [ItemStateAction.unstash]
  }
}

/** Orders states by how present an Item is: Stashed < Available < active. */
function presenceRank(state: ItemState): number {
  if (state === ItemState.stashed) return 0
  if (state === ItemState.available) return 1
  return 2
}

/**
 * The highest state an Attachment can be in under a parent in `parentState`: never more active
 * than its parent. A top-level Item (no parent) is unconstrained.
 */
function clampToParent(state: ItemState, parentState: ItemState | undefined): ItemState {
  if (parentState === undefined || presenceRank(state) <= presenceRank(parentState)) return state
  return presenceRank(parentState) === 0 ? ItemState.stashed : ItemState.available
}

/**
 * Whether an Attachment whose parent is in `parentState` may be put in `state` — it may never be
 * more active than its parent. Always true for a top-level Item (`parentState` undefined).
 */
export function isItemStateWithinParent(state: ItemState, parentState: ItemState | undefined): boolean {
  return clampToParent(state, parentState) === state
}

/**
 * The state an Attachment moves to when its parent moves from `parentBefore` to `parentAfter`:
 * Stash and Unstash take the whole tree with them, and Equip/Implant/Unequip/Extract reach only
 * Attachments whose type has that same active state. An Attachment never ends up more active than
 * its parent.
 */
function cascadeChildState(child: ItemData, parentBefore: ItemState, parentAfter: ItemState): ItemState {
  const childState = getItemState(child)

  if (parentAfter === ItemState.stashed) return ItemState.stashed

  let next = childState
  if (parentBefore === ItemState.stashed && childState === ItemState.stashed) {
    next = ItemState.available
  }
  if (isActiveItemState(parentAfter) && next === ItemState.available && isItemStateAllowed(child.itemType, parentAfter)) {
    next = parentAfter
  }
  if (isActiveItemState(parentBefore) && !isActiveItemState(parentAfter) && next === parentBefore) {
    next = ItemState.available
  }

  return clampToParent(next, parentAfter)
}

function applyCascade(catalog: ItemCatalog, parent: ItemData, parentBefore: ItemState): void {
  const parentAfter = getItemState(parent)
  if (parentAfter === parentBefore) return

  for (const childId of parent.items.childIds) {
    const child = catalog[childId]
    if (!child) continue

    const childBefore = getItemState(child)
    const childAfter = cascadeChildState(child, parentBefore, parentAfter)
    if (childAfter === childBefore) continue

    child.state = childAfter
    applyCascade(catalog, child, childBefore)
  }
}

/**
 * Brings the Item at `itemId` in `catalog` (mutated in place) to a valid state after a write: a
 * state its type doesn't allow falls back to `previousState` (or Available), an Attachment is
 * capped at its parent's presence, and the change cascades to its own Attachments.
 *
 * @param previousState - the Item's state before the write, or `undefined` for a newly added Item.
 */
export function reconcileItemState(catalog: ItemCatalog, itemId: ItemData["id"], previousState: ItemState | undefined): void {
  const item = catalog[itemId]
  if (!item) return

  let state = getItemState(item)
  if (!isItemStateAllowed(item.itemType, state)) {
    state = previousState !== undefined && isItemStateAllowed(item.itemType, previousState)
      ? previousState
      : ItemState.available
  }

  const parent = item.items.parentId ? catalog[item.items.parentId] : undefined
  state = clampToParent(state, parent ? getItemState(parent) : undefined)

  if (state !== getItemState(item)) item.state = state
  applyCascade(catalog, item, previousState ?? state)
}
