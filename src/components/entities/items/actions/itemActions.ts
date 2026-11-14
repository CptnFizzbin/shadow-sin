import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

/** Something a Player can do with an Item from its actions dialog. */
export enum ItemAction {
  equip = "equip",
  unequip = "unequip",
  stash = "stash",
  unstash = "unstash",
  attack = "attack",
  run = "run",
  edit = "edit",
  sell = "sell",
  delete = "delete",
}

interface ItemActionContext {
  /** Whether the Item is an Attachment, which shares its parent's Stashed and Equipped state. */
  isAttachment: boolean
  /** Whether the Runner is being played (the Viewer) rather than built. */
  isViewer: boolean
}

/** The actions an Item offers, in the order its actions dialog lists them. */
export function getItemActions(item: ItemData, { isAttachment, isViewer }: ItemActionContext): ItemAction[] {
  const actions: ItemAction[] = []

  if (!isAttachment) {
    if (!item.stashed) actions.push(item.equipped ? ItemAction.unequip : ItemAction.equip)
    actions.push(item.stashed ? ItemAction.unstash : ItemAction.stash)
  }

  if (isViewer && !item.stashed) {
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

/** The on-screen label for where an Item is: Equipped, Carried, or Stashed. */
export function getCarryStatusLabel(item: ItemData): string {
  if (item.stashed) return "Stashed"
  return item.equipped ? "Equipped" : "Carried"
}
