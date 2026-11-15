import {
  getItemState,
  getItemStateActions,
  getItemStateLabel,
  isItemOnHand,
  isItemStateWithinParent,
  ItemStateAction,
  itemStateActionTargets,
} from "#/system/formulas/items/itemStateRules.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

/** Something a Player can do with an Item from its actions dialog. */
export enum ItemAction {
  equip = "equip",
  unequip = "unequip",
  implant = "implant",
  extract = "extract",
  stash = "stash",
  unstash = "unstash",
  consume = "consume",
  endEffect = "endEffect",
  attack = "attack",
  run = "run",
  edit = "edit",
  sell = "sell",
  delete = "delete",
}

interface ItemActionContext {
  /** Whether the Item is an Attachment. A fixed Attachment can't be sold or deleted on its own. */
  isAttachment: boolean
  /**
   * The state of the Item's parent, when it is an Attachment. An Attachment is never offered a
   * state more present than its parent's.
   */
  parentState?: ItemState
  /** Whether the Runner is being played (the Viewer) rather than built. */
  isViewer: boolean
}

const itemActionForStateAction: Record<ItemStateAction, ItemAction> = {
  [ItemStateAction.equip]: ItemAction.equip,
  [ItemStateAction.unequip]: ItemAction.unequip,
  [ItemStateAction.implant]: ItemAction.implant,
  [ItemStateAction.extract]: ItemAction.extract,
  [ItemStateAction.stash]: ItemAction.stash,
  [ItemStateAction.unstash]: ItemAction.unstash,
  [ItemStateAction.consume]: ItemAction.consume,
  [ItemStateAction.endEffect]: ItemAction.endEffect,
}

const stateActionForItemAction: Partial<Record<ItemAction, ItemStateAction>> = {
  [ItemAction.equip]: ItemStateAction.equip,
  [ItemAction.unequip]: ItemStateAction.unequip,
  [ItemAction.implant]: ItemStateAction.implant,
  [ItemAction.extract]: ItemStateAction.extract,
  [ItemAction.stash]: ItemStateAction.stash,
  [ItemAction.unstash]: ItemStateAction.unstash,
  [ItemAction.consume]: ItemStateAction.consume,
  [ItemAction.endEffect]: ItemStateAction.endEffect,
}

/** The actions an Item offers, in the order its actions dialog lists them. */
export function getItemActions(
  item: ItemData,
  { isAttachment, parentState, isViewer }: ItemActionContext,
): ItemAction[] {
  const actions: ItemAction[] = getItemStateActions(item)
    .filter((stateAction) => isItemStateWithinParent(itemStateActionTargets[stateAction], parentState))
    .map((stateAction) => itemActionForStateAction[stateAction])

  if (isViewer && isItemOnHand(item)) {
    if (item.itemType === ItemType.weapon) actions.push(ItemAction.attack)
    if (item.itemType === ItemType.program) actions.push(ItemAction.run)
  }

  actions.push(ItemAction.edit)

  // A fixed Attachment is part of its parent, so it goes wherever its parent goes.
  const isRemovable = !(isAttachment && item.fixed)
  if (isRemovable) {
    if (isViewer) actions.push(ItemAction.sell)
    actions.push(ItemAction.delete)
  }

  return actions
}

/** The on-screen label for an Item's state, e.g. Equipped, Implanted, Active, Available, Loaded, or Stashed. */
export function getItemStateDisplayLabel(item: ItemData): string {
  return getItemStateLabel(item.itemType, getItemState(item))
}

/** The state an Item moves into when the Player picks `action`, if `action` changes its state. */
export function getItemActionTargetState(action: ItemAction): ItemState | undefined {
  const stateAction = stateActionForItemAction[action]
  return stateAction ? itemStateActionTargets[stateAction] : undefined
}
